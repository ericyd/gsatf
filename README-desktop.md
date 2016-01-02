Geological Society of America (GSA) Table Formatter

INSTALLATION
==========================

This program does not require installation.  Simply run the executable or the included shortcut in the root directory.
If you choose to run/build this program from source, you will need the wxPython module, freely available at www.wxpython.org.


USER GUIDE
==========================

This program was designed to be intuitive and easy to use.  However, there are some key points to note:

1. Data files can only be loaded from *.csv or *.txt files.  Any other files (e.g. Excel files *.xls or *.xlsx) will not work.

    - If you are using Excel, simply enter you data as normal then select "Save As" then select your filetype as "CSV" from the dropdown bar.
  
2. Headers need to be entered into the text bar with a comma (,) separating each header.  Do not write headers that include an internal comma as this will mess everything up.  Units should be put inside closed parentheses after the header name.

    - Example header entry: Location Name,Length (m),Width (m),Area (m^2)
  
3. The program defaults to loading a Title and Column Headers from the data file itself.  If the data file does not include title and/or headers, there are options to override this default and add/adjust your own by selecting one of the options in the appropriate areas.
4. The "Preview" button allows you to see the table with the settings you have implemented.  The "Refresh" button will load any changes made since the last preview was loaded.
5. Copying tables from the "Preview" pane into Word or other text editor is easy:  

    1. Click the "Select All" button below the preview pane
    2. Press Ctrl+C for "copy" or Right-click and select "Copy"
    3. Open a Word document, and click Ctrl+V for "paste" or Right-click and select "Paste"
    4. This is now a working Word Document table that can be edited as needed.
  
6. Footnotes are the least user-friendly portion of this program.  Once you enable footnotes and select how many footnotes you would like to include, simply type in the text of the footnote in the text entry bar.  A superscript index will automatically be generated for your footnote.

    - Attaching a footnote to a particular piece of data requires selecting the row and column at which you would like the footnote index added.  NOTE: Row 0 is the Headers row.  Row 1/Col 1 is the first row and column of data.



UNSUPPORTED STYLE ELEMENTS
==========================

Most GSA formatting guidelines are accounted for.  However, there are a few that have yet to be implemented:

1. Sub headings cannot be added.  That is, if a heading needs sub-division into component parts (e.g. "Location" being split into "Latitude" and "Longitude"), it cannot be done with this tool.
2. Separate sections of the table body cannot be separated per GSA standards.
3. Text entries can appear, but multi-line text entries will not be indented below the first line.
4. Footnotes will use letters 'a-z' rather than other symbology
5. Notes included in the footnotes section must be attached to footnotes at this point.  That is, you cannot make a general note unless there is a row and colum attached to it.

These inconsistencies will be addressed in future versions.


KNOWN BUGS
==========================

1. This program was written before I knew how to write proper programs, so everything is included in one large script.  I am aware that this is bad practice and will hopefully remedy in the future.
2. I have included a compiled version of the program, created using PyInstaller.  It only works on Linux.
3. I will update this list when I re-visit this project and figure out exactly where I left off.
