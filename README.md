# GSATF Web app #

Geological Society of America Table Formatter (GSATF) is a tool to format data tables according to GSA standards for use in publications.  The GSA standards are outlined on [their website](http://www.geosociety.org/pubs/geoguid6.htm) and in the [sample table](http://www.geosociety.org/pubs/booktable.pdf) that they produce.  The goal of this application is to adhere as closely as possible to those standards while maintaining an easy-to-use interface that assumes no pre-existing experience with the application or special technical knowledge outside of creating a basic data table in any spreadsheet program.

--------

## Usage ##

The app is divided into two major steps:

### 1. Input your data ###

Inputing data can currently only be done by copying and pasting data from a spreadsheet.  The data from most popular spreadsheet programs (e.g. LibreOffice, Microsoft Excel, etc.) copies in a tab-delimited format, which is what the app expects.  Data inserted in a non-tab-delimited format will not be parsed correctly.  This behavior will eventually be modified to support alternate delimiters, such as commas.

To copy data into the program, open a data table in a spreadsheet program (or a text editor if its already saved in a tab-delimited format).  Select the entire range of data and copy with Ctrl-C.  In the app, click the "Copy & Paste" button, and paste your data to the text box with Ctrl-V.  Click the "Submit" button to process your data.

For demonstration purposes, a text box with a sample data table has been provided.  To see the output, simply copy the contents of the text body, and paste into the "Copy & Paste" popup.

**Future tasks:**

1. Enable uploading of comma- or tab-delimited data table files for parsing.
2. In "Copy & Paste" mode, support parsing for data with non-tab delimiters (such as commas).  

### 2. Copy formatted table into publication ###

If the table is rendered as desired, including the formatted table into the publication is as simple as:

1. Click the "Select table contents" button.  This will automatically select the entire table contents.
2. Copy the table to your clipboard with Ctrl-C.
3. Paste the formatted table into your word processor.

## Additional features ##

While most usage of the GSA Table Formatter is as simple as the two-step process outlined above, some additional functionality has been built into GSATF to enhance the user experience and make table formatting as seamless as possible.

### Editable cells ###

Every cell in the formatted table is editable by simply clicking on the contents of the cell.  While this function is identical to what you might find in a word processor, the goal of GSATF is to produce a finished product prior to inclusion in the final publication.  This feature can be handy for users that would like to edit the data in the table without fear of affecting the formatting of the table (e.g. changing column width).  This functionality is provided with the [angular-xeditable](http://vitalets.github.io/angular-xeditable/) module.

### Automatic removal of comments ###

Data tables often have comments regarding the collection and explanation of the data.  Comments will be automatically removed from inserted data if the line begins with a `#` character or two forward slash characters, `//`.

### Automatic parsing of headings ###

GSATF will parse the column headers and automatically take the dimension (units) of the column and place it on a separate line, per the GSA standards.  For this to work properly, dimenions (units) for columns must be enclosed in parentheses, `()`.  Some examples are shown below:

| Text             | Formatted output      |
|------------------|-----------------------|
| Length (m)       | Length <br> (m)       |
| Mass (kg)        | Mass <br> (kg)        |
| Area (m^2)       | Area <br> (m^2)       |
| Density (kg/m^3) | Density <br> (kg/m^3) |

Please note that at this time, superscripts and subscripts are not processes, and will remain as plain text:

In addition, headings that are divided into two or more subheadings _can_ be automatically split if the table is entered with a specific syntax.  The subheadings for a given heading must be entered in square brackets, `[]` after the main heading.  Each subheading must be separated by commas.  Below is an example of how to enter this:

<table>
    <tr>
        <th>Text</th>
        <th>Formatted output</th>
    </tr>
    <tr>
        <td>
            Location [Lat (degrees), Long (degrees)]
        </td>
        <td style="text-align:center" colspan="2">
            Location
            <table>
                <tr style="border-top:1px solid #000;">
                    <td>Lat<br>(degrees)</td>
                    <td>Long<br>(degrees)</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
 

## Current limitations ##

This software is currently in development.  As such, there are a few notable limitations in its performance.

1. Users cannot currently insert footnotes
2. Users cannot add superscripts or subscripts to table cells
3. Users cannot add greek characters or other special characters to table cells
4. Table cells that contain long strings of text do not automatically align left, as specified by the GSA standards
5. Tables do not copy into a word processor in a sans-serif font, as specified by GSA standards

These issues are currently being worked on and should be fixed by version 1.0.

## Bugs ##

Though the app is currently under development, any bug reports are appreciated.  Please open an issue in the Github issues tracker if you notice a bug in the app.

## Copyright ##

This app is licensed under the GPL-3.0 license.

Please note that The Geological Society of America and GSA are copyrights of [The Geological Society of America](http://www.geosociety.org/), and they do not endorse or sponsor this application.