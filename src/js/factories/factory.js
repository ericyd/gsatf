/* This contains the data parser function
This uses the sprintf.js found here https://github.com/alexei/sprintf.js*/


/*
FACTORY
*/
gsatf.factory("gsatfFactory", function() {
    var factory = {};
    var table = {
        title: "",
        headers: {
            heads: [],
            headDimensions: [],
            subheads: [],
            subheadDimensions: [] 
        },
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
        borderTop: "borderTop",
        nCols: 0, // updated in script
        nRows: 1
    };
    
    
    // is this needed? eliminate?
    factory.getTable = function() {
        return table;
    };
    
    
    
    /* extractData is passed the text from the textarea.
    It parses this data and fills the variable `table` with the relevant parts,
    so that buildHtml() can create the proper table from the correct data
    */
    factory.extractData = function(data) {
        var isFilled = function(x) { return x !== ""; };
        var isNotComment = function(x) { return (x[0] != "#" && x.slice(0,2) != "//"); };
        var reFootnoteInc = /\*\d+/; //inclusive
        var reFoodnoteExc = /\*(\d+)/; //exclusive
        var reSubhead = /\[(.*)\]/;
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
        // todo: figure out why I need the "-1" in the `for` declaration - it seems hacky
        for (var i = 0; i < headers.length - 1; i++) {
            
            // test the heading for subheads
            if ( reSubhead.test(headers[i]) ) {
                table.headers.heads[i] = headers[i].slice(0, headers[i].search(reSubhead));
                table.headers.subheads[i] = headers[i].match(reSubhead)[1].split(",");
                css.nRows = 2;
                
                // loop through the subheads and separate dimensions
                for (var j = 0; j < table.headers.subheads[i].length; j++) {
                    
                    // if subhead contains reDimension
                    if ( reDimension.test(table.headers.subheads[i][j]) ) {
                        
                        // create an array to hold subheadDimensions only if it doesn't exist
                        if (table.headers.subheadDimensions[i] === undefined) {
                            table.headers.subheadDimensions[i] = [];    
                        } 
                        
                        // fill the subheadDimensions
                        table.headers.subheadDimensions[i][j] = table.headers.subheads[i][j].match(reDimension)[0];
                        table.headers.subheads[i][j] = table.headers.subheads[i][j].slice(0, table.headers.subheads[i][j].search(reDimension));
                    }
                }
            } else {
                
                table.headers.heads[i] = headers[i];
            }
            
            // test the heading for dimensions
            if ( reDimension.test(headers[i]) ) {
                table.headers.headDimensions[i] = table.headers.heads[i].match(reDimension)[0];
                table.headers.heads[i] = table.headers.heads[i].slice(0, headers[i].search(reDimension));
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
        for (var i = 0; i < table.headers.heads.length; i++) {
            var id = i < 10 ? "010" + i.toString() : "01" + i.toString();
            
            var textAlign = i == 0 ? css.left : css.center;
            
            // if there are subheadings
            if (table.headers.subheads[i] !== undefined) {
                // no rowspan
                headers += sprintf("<td colspan=%i id='%s' class='%s %s'>", table.headers.subheads[i].length, id, textAlign, css.trBreak);
            } else {
                // yes rowspan
                headers += sprintf("<td rowspan=%i id='%s' class='%s %s'>", css.nRows, id, textAlign, css.trBreak);
            }
            
            // add editable text into cell
            headers += sprintf("<span editable-text='table.headers.heads[%i]'>{{ table.headers.heads[%i] }}</span>", i, i);
            
            // if there is a corresponding dimension for the header, print it on a separate line
            if (table.headers.headDimensions[i] !== undefined ) {
                headers += sprintf("<br /><span editable-text='table.headers.headDimensions[%i]'>{{ table.headers.headDimensions[%i] }}</span>", i, i);
            }
            
                            
            // if there are subheadings
            if (table.headers.subheads[i] !== undefined) {
                                
                // add second row (subheading)
                headers += "<tr>";
                
                // iterate through items in subheadings array
                
                for (var j = 0; j < table.headers.subheads[i].length; j++) {
                    
                    headers += sprintf("<td class='%(center)s %(trBreak)s'>", css);
                    headers += sprintf("<span editable-text='table.headers.subheads[%i][%i]'>{{ table.headers.subheads[%i][%i] }}</span>", i, j, i, j);
                    
                    // if there is a corresponding dimension for the subheader, print it on a separate line
                    if (table.headers.subheadDimensions[i] !== undefined ) {
                        headers += sprintf("<br /><span editable-text='table.headers.subheadDimensions[%i][%i]'>{{ table.headers.subheadDimensions[%i][%i] }}</span>", i, j, i, j);
                    }                    
                }
                

                headers += "</tr>";    
            } 
            
            // end the header cell
            headers += "</td>";

        }

        return headers + "</tr>";
        
    }
    
    
    
    function getBody() {
        
        var bodyHtml = "";
        
        // iterate through remaining rows, and process
        for (var i = 0; i < table.body.length; i++) {
            
            var row = table.body[i];
            bodyHtml += "<tr>";
            
            // if there's only a single element in the row
            if (table.body[i].length == 1) {
                
                var id = i < 10 ? "0" + i.toString() + "00" : i.toString() + "00";
                bodyHtml += sprintf("<td id='%s' colspan=%s class='%s'><span editable-text='table.body[%s][0]'>", id, css.nCols, css.tdSubhead, i);
                bodyHtml += sprintf("{{ table.body[%s][0] }}</span></td></tr>", i);
                
            } else {
                
                // loop through and process 
                for (var j = 0; j < table.body[i].length; j++) {
                    var textAlign = j == 0 ? css.left : css.center;
                    
                    var I = i < 10 ? "0"+i.toString() : i.toString();
                    var J = j < 10 ? "0"+j.toString() : j.toString();
                    bodyHtml += sprintf("<td id='%s' class='%s %s'><span editable-text='table.body[%i][%i]'>%s</span></td>", I+J, css.tdBody, textAlign, i, j, "{{ table.body[" + i + "][" + j + "] }}");
                }
            }
                

            bodyHtml += "</tr>";
        }
        
        return bodyHtml;
    }
    
    
    
    function getFootnotes() {
        var html = sprintf("<tr><td colspan=%i class='%s'></td></tr>", css.nCols, css.borderTop);
        
        return html;
    }
    

    
    return factory;
});