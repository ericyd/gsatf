/* This contains the data parser function
This uses the sprintf.js found here https://github.com/alexei/sprintf.js*/


/*
FACTORY
*/
gsatf.factory("gsatfFactory", function() {
    var factory = {};
    var table = {
        title: "",
        headers: [[],[],[],[]],
        body: [],
        footnotes: []
    };
    
    var tableHtml = "";
    
    // declare css variables
    var css = {
        trTitle: "trTitle",
        trBreak: "trBreak",
        tdTitle: "tdTitle", //font-weight:bold; (apparently not in the specs)
        center: "center",
        left: "left",
        right: "right",
        tdSubhead: "tdSubhead",
        tdBody: "tdBody",
        nCols: 0, // updated in script
        nRows: 1
    };
    
    factory.getTable = function() {
        return table;
    };
    
    
    
    factory.extractData = function(data) {
        var isFilled = function(x) { return x !== ""; };
        var isNotComment = function(x) { return (x[0] != "#" && x.slice(0,2) != "//"); };
        var reFootnoteInc = /\*\d+/; //inclusive
        var reFoodnoteExc = /\*(\d+)/; //exclusive
        var reSubhead = /\[.*\]/;
        var reDimension = /(\(.*\))/;
        
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
        
        // Get headers row
        var headers = data.shift();
        
        // split headers into the title and any corresponding dimensions
        for (var j = 0; j < headers.length; j++) {
            // test the heading for subheads
            if ( reSubhead.test(headers[j]) ) {
                table.headers[0][j] = headers[j].slice(0, headers[j].search(reSubhead));
                table.headers[2][j] = headers[j].match(reSubhead)[0];
                css.nRows = 2;
            } else {
                table.headers[0][j] = headers[j];
            }
            
            // test the heading for dimensions
            if ( reDimension.test(headers[j]) ) {
                table.headers[1][j] = table.headers[0][j].match(reDimension)[0];
                table.headers[0][j] = table.headers[0][j].slice(0, headers[j].search(reDimension));
            }
            
            // test the subhead for dimensions
            if ( reDimension.test(table.headers[2][j]) ) {
                table.headers[3][j] = table.headers[2][j].match(reDimension)[0];
                table.headers[2][j] = table.headers[2][j].slice(0, table.headers[2][j].search(reDimension));
            }
            
        }
        
        // The remaining data is the body
        table.body = data;
        
    } // function extractData
    
    
    /* buildHtml returns a string of the html table
    the contents are retrieved from the table variable
    which is filled when the extractData function is called
    */
    factory.buildHtml = function() {
        tableHtml = '<table cellspacing=0 border=0>';
        tableHtml += getTitle();
        tableHtml += getHeaders();
        tableHtml += getBody();
        tableHtml += getFootnotes();
        tableHtml += "</table>";
        return tableHtml;
    } 

    function getTitle() {
        // set up html for first row
        var head = sprintf("<tr><td id='0000' colspan='%(nCols)i' class='%(tdTitle)s %(center)s %(trTitle)s'><span editable-text='table.title'>", css);
        var tail = "</span></td></tr>";
        return head + "{{ table.title }}" + tail;
    }

    function getHeaders() {
        
        var reDimension = /\(.*\)/;
        
        // begin the header row    
        var headers = "<tr>";
        
        // iterate through headings
        for (var j = 0; j < table.headers[0].length; j++) {
            var id = j < 10 ? "010" + j.toString() : "01" + j.toString();
            
            // if there are subheadings
            if (table.headers[2][j] !== undefined) {
                // no rowspan
                headers += sprintf("<td id='%s' class='%s %s'>", id, css.center, css.trBreak);
            } else {
                // yes rowspan
                headers += sprintf("<td rowspan=%i id='%s' class='%s %s'>", css.nRows, id, css.center, css.trBreak);
            }
            
            // add editable text into cell
            headers += sprintf("<span editable-text='table.headers[0][%i]'>{{ table.headers[0][%i] }}</span>", j, j);
            
            // if there is a corresponding dimension for the header, print it on a separate line
            if (table.headers[1][j] !== undefined ) {
                headers += sprintf("<br /><span editable-text='table.headers[1][%i]'>{{ table.headers[1][%i] }}</span>", j, j);
            }
            
            
            // if there are subheadings
            if (table.headers[2][j] !== undefined) {
                
                // add second row (subheading)
                headers += "<tr>";
                headers += sprintf("<td class='%(center)s %(trBreak)s'>", css);
                headers += sprintf("<span editable-text='table.headers[2][%i]'>{{ table.headers[2][%i] }}</span>", j, j);
                
                // if there is a corresponding dimension for the subheader, print it on a separate line
                if (table.headers[3][j] !== undefined ) {
                    headers += sprintf("<br /><span editable-text='table.headers[3][%i]'>{{ table.headers[3][%i] }}</span>", j, j);
                }
                
                headers += "</tr>";    
            } 
            
            // end the header cell
            headers += "</td>";

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
                    bodyHtml += sprintf("<td id='%s' class='%s %s'><span editable-text='table.body[%i][%i]'>%s</span></td>", I+J, css.tdBody, css.center, i, j, "{{ table.body[" + i + "][" + j + "] }}");
                }
                
            } else {
                for (var j = 0; j < table.body[i].length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    bodyHtml += sprintf("<td id='%s' class='%s %s %s'><span editable-text='table.body[%i][%i]'>%s</span></td>", I+J, css.tdBody, css.center, css.trBreak, i, j, "{{ table.body[" + i + "][" + j + "] }}");
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
    

    
    return factory;
});










/*
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
                    tableHtml += sprintf("<td id='%s' class='%s'>%s</td>", I+J, css.tdBody, row[j]);
                }
                
            } else {
                for (var j = 0; j < row.length; j++) {
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    tableHtml += sprintf("<td id='%s' class='%s %s'>%s</td>", I+J, css.tdBody, css.trBreak, row[j]);
                }
            }
            
            
            
    
            tableHtml += "</tr>";
        }
        
        tableHtml += "</table>";
    
        return table;



    }; // function parseData
    */