/* This contains the data parser function
This uses the sprintf.js found here https://github.com/alexei/sprintf.js*/


/*
FACTORY
*/
gsatf.factory("gsatfFactory", function() {
    var factory = {};
    var table = {
        title: "",
        headers: [],
        body: [],
        footnotes: []
    };
    
    var tableHtml = "";
    
    // declare css variables
    var css = {
        trTitle: "trTitle",
        trBreak: "trBreak",
        tdTitle: "tdTitle", //font-weight:bold; (apparently not in the specs)
        tdCenter: "tdCenter",
        tdSubhead: "tdSubhead",
        tdAll: "tdAll",
        nCols: 0, // updated in script
        nRows: 0
    };
    
    factory.getTable = function() {
        return table;
    };
    
    factory.extractData = function(data) {
        var isFilled = function(x) { return x !== ""; };
        var isNotComment = function(x) { return (x[0] != "#" && x.slice(0,2) != "//"); };
        var reFootnoteInc = /\*\d+/; //inclusive
        var reFoodnoteExc = /\*(\d+)/; //exclusive
        
        // split each row into an array
        data = data.split(/\n/);
        
        // clear empty rows at end and comments
        data = data.filter(isFilled).filter(isNotComment);
        
        // split rows into cells & strip empty cells from "title rows" (rows where only the first cell is populated)
        for (i = 0; i < data.length; i++) { 
            data[i] = data[i].split(/\t/); 
            data_filter = data[i].filter(isFilled);
            // if there's only one non-empty cell AND its the first cell in the array
            if (data_filter.length == 1 && data_filter[0] == data[i][0]) {
                data[i] = data_filter;
            }
        }
        
        // find max row length (= num of cols) - note: slice() effectively creates a copy of data, so the sorting doesn't affect the table
        css.nCols = data.slice().sort(function (a, b) { return b.length - a.length; })[0].length;
        
        // Create Title (or empty placeholder)
        // one element in first row indicates that its a built-in title
        if (data[0].length == 1) {
            table.title = data.shift()[0];
        // more than one element indicates that its the headers; less than one is likely an error
        } else {
            table.title += "Title 1."; 
        }
        
        // Get headers
        table.headers = data.shift();
        
        // iterate through remaining rows, and push into table.body
        for (var i = 0; i < data.length; i++) {
            table.body.push(data[i]);
        }
    } // function extractData
    
    factory.parseData = function(information) {

        //del = cellDelimiter;
        
        // Declare other variables
        //var data = angular.element(document.getElementById('textbox')).value; //$("#textBox").val();
        var data = information;
        
        //var table = '<table class="table">';
        //var table = '<table cellspacing=0 border=0>';
        tableHtml = '<table cellspacing=0 border=0>';
        var isFilled = function(x) { return x !== ""; };
        var isNotComment = function(x) { return (x[0] != "#" && x.slice(0,2) != "//"); };
        var reFootnoteInc = /\*\d+/; //inclusive
        var reFoodnoteExc = /\*(\d+)/; //exclusive
        
        // split each row into an array
        data = data.split(/\n/);
        
        // clear empty rows at end
        //while (data[data.length - 1] == "") { data.pop(); };
        data = data.filter(isFilled).filter(isNotComment);
        
        // split rows into cells & strip empty cells from "title rows" (rows where only the first cell is populated)
        for (i = 0; i < data.length; i++) { 
            data[i] = data[i].split(/\t/); 
            data_filter = data[i].filter(isFilled);
            // if there's only one non-empty cell AND its the first cell in the array
            if (data_filter.length == 1 && data_filter[0] == data[i][0]) {
                data[i] = data_filter;
            }
        }
        
        // find max row length (= num of cols) - note: slice() effectively creates a copy of data, so the sorting doesn't affect the table
        css.nCols = data.slice().sort(function (a, b) { return b.length - a.length; })[0].length;

        // Create Title (or empty placeholder)
        // one element in first row indicates that its a built-in title
        if (data[0].length == 1) {
            tableHtml += getTitle(data.shift()[0], css);
        // more than one element indicates that its the headers; less than one is likely an error
        } else {
            tableHtml += getTitle("Title 1.", css); 
        }
        
        
        
        // Get headers
        tableHtml += getHeaders(data.shift(), css);
        data.unshift("", "");
        
        // iterate through remaining rows, and process
        for (var i = 2; i < data.length; i++) {
            var row = data[i];
            tableHtml += "<tr>";
            
            // if its not the first or last line of the table...
            if ( i != data.length - 1 ) {
                
                
                if (row.length == 1) {
                    var id = i < 10 ? "0" + i.toString() + "00" : i.toString();
                    tableHtml += sprintf("<td id='%s' colspan='%s' class='%s %s'>", id, css.nCols, css.tdSubhead);
                    tableHtml += row[0] + "</td></tr>";
                    continue;
                }
                
                for (var j = 0; j < row.length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    tableHtml += sprintf("<td id='%s' class='%s'>%s</td>", I+J, css.tdAll, row[j]);
                }
                
            } else {
                for (var j = 0; j < row.length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    tableHtml += sprintf("<td id='%s' class='%s %s'>%s</td>", I+J, css.tdAll, css.trBreak, row[j]);
                }
            }
            
            
            
    
            tableHtml += "</tr>";
        }
        
        tableHtml += "</table>";
    
        return table;



    }; // function parseData


    function getTitle() {
        // set up html for first row
        var head = sprintf("<tr><td id='0000' colspan='%(nCols)i' class='%(tdTitle)s %(tdAll)s %(trTitle)s'><span editable-text='table.title'>", css);
        var tail = "</span></td></tr>";
        return head + "{{ table.title }}" + tail;
    }

    function getHeaders() {
        
        var reDimension = /\(.*\)/;
            
        var headers = "<tr>";
        
        for (var j = 0; j < table.headers.length; j++) {
            var id = j < 10 ? "010" + j.toString() : "01" + j.toString();
            if ( reDimension.test(table.headers[j]) ) {
                // For some reason, this if statement is running twice.  Check out the console
                console.log(reDimension);
                console.log(table.headers[j].match(reDimension)[0]);
                console.log(table.headers[j])
                table.headers[j] = table.headers[j].replace(reDimension, "<br />" + table.headers[j].match(reDimension)[0]);
                console.log(table.headers[j]) 
            }
            
            headers += sprintf("<td id='%s' class='%s %s'>", id, css.tdCenter, css.trBreak);
            headers += sprintf("<span editable-text='table.headers[%i]'>{{ table.headers[%i] }}</span></td>", j, j);
        }
        return headers + "</tr>";
        
    }
    
    function getBody() {
        var data = table.body;
        var bodyHtml = "";
        
        // iterate through remaining rows, and process
        for (var i = 0; i < table.body.length; i++) {
            var row = table.body[i];
            bodyHtml += "<tr>";
            
            // if its not the first or last line of the table...
            if ( i != table.body.length - 1 ) {

                if (table.body[i].length == 1) {
                    var id = i < 10 ? "0" + i.toString() + "00" : i.toString();
                    bodyHtml += sprintf("<td id='%s' colspan='%s' class='%s %s'><span editable-text='table.body[%i][0]'>", id, css.nCols, css.tdSubhead, i);
                    bodyHtml += "{{ table.body[" + i + "][0] }}" + "</span></td></tr>";
                    continue;
                }
                
                for (var j = 0; j < table.body[i].length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    bodyHtml += sprintf("<td id='%s' class='%s'><span editable-text='table.body[%i][%i]'>%s</span></td>", I+J, css.tdAll, i, j, "{{ table.body[" + i + "][" + j + "] }}");
                }
                
            } else {
                for (var j = 0; j < table.body[i].length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    bodyHtml += sprintf("<td id='%s' class='%s %s'><span editable-text='table.body[%i][%i]'>%s</span></td>", I+J, css.tdAll, css.trBreak, i, j, "{{ table.body[" + i + "][" + j + "] }}");
                }
            }

            bodyHtml += "</tr>";
        }
        
        return bodyHtml;
    }
    
    function getFootnotes() {
        var html = "";
        
        return html;
    }
    
    factory.buildHtml = function() {
        tableHtml = '<table cellspacing=0 border=0>';
        tableHtml += getTitle();
        tableHtml += getHeaders();
        tableHtml += getBody();
        tableHtml += getFootnotes();
        tableHtml += "</table>";
        return tableHtml;
    } 
    
    return factory;
});
