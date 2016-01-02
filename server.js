/* If this script isn't working right, then cd into the root directory and run
    npm install express
    
express seems to be the package that allows this to run properly.
Then navigate to http://localhost:8080/<filename> e.g. http://localhost:8080/index.html
*/

var express = require('express'),
    app = express();

app.use(express.static(__dirname + ''));

app.listen(8080)
