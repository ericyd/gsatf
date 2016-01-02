# To Do #

### GSATF work

0. Figure out how to make the compiled info in the "dynamic" directive act as normal html, so that it doesn't get all weird
    maybe add $sce.trustAsHtml(html) to the ele.html() comand.  That command is setting the contents of ele, then the $compile command compiles it.  So whatever is in ele.html should be true html (??)
0. Extract data and populate `table` varialble, then build html with dynamic injections of `table` properties.  This will allow it to work with angular xeditable
1. Add animations between views
2. Adjust colors/theme for app (bootstrap)

5. Finish parser
    1. Parse footnotes on each cell, denoted either by \*1, \*2, \*3 etc or ^1 ^2 ^3 etc
    2. parse headings with sub-headings (e.g. Coords [Lat, Long]) with syntax where [el1, el2, el3] indicates sub-heads
    3. First column of TDs should be text-align: left, not center
    4. make "#" characters comments.  Make "//" an automatic table "Note" (see #12 in booktable.pdf).  Also make "Note:etc." a footnote if row.length == 1
    5. add cell padding
    6. decrease font size
6. integrate angular xeditable
    1. make cell contents editable
    2. add ability to adjust text-alignment
    3. Add ability to insert Greek characters into text (?)
    4. Add ability to add footnotes (maybe won't requite xeditable?)
7. Make a demo/how-to view, that walks people through how to work the app
8. Add support for uploading files
0. ~~Add popover to "Upload File" button saying "Coming soon, not currently supported"~~
3. ~~Instead of styling each cell, add generic classes.  This will help with editing individual cells (I think)~~ 
4. ~~In `pages/view2.html`, change "enter different data" to be button at top with "back" icon~~

### Node modules

1. Use node for packages
    1. Angular
    2. Bootstrap
    3. jQuery
    4. sprintf.js (?)
2. Learn how to use Browserify (and Watchify)
    

### ~~Clean up webapp directory~~

1. ~~Remove extraneous files~~
2. ~~Organize `js` folder~~
    * ~~js/app/controller /directives /route /factory~~
    * ~~js/assets (?) e.g. sprint.js, bootstrap, angular, jQuery~~
3. ~~layout project with everything under `src/` directory which is located at root~~
        
### ~~Gulp~~

2. ~~Build complete distribution copy in dist~~
3. ~~Package node modules (e.g. Angular, Bootstrap) into dist~~
4. ~~Adjust index.html paths for scripts and css~~ 
    * Maybe this isn't necessary because I should be coding for the dist version, not the src version?  So, my index.html paths should point to my dist directories, not my src directories or CDNs

5. ~~Make it watch automatically for changes~~

### Git

6. ~~update site with alert regarding changes~~
    * ~~Possibly link to v1.0 repo zip?~~

1. ~~Save copy of python files for my records~~
2. ~~Move `webapp` directory to root~~
3. ~~Create tag for new version 1.9.1 ("alpha" of v2.0)~~
4. ~~Update README.md~~
5. ~~push changes~~
    * ~~push tags!~~