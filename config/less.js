var less = require('less');
var fs = require( 'fs' );
var path = require('path');

var opts = {
    sourceMap: true
};

var sheets_path = path.join(__dirname,'../public/design/css'),
    less_file = path.join(sheets_path,'main.less'),
    css_file = path.join(sheets_path,'main.css');

module.exports = function(){

    // Doesnt work

    fs.readFile(less_file, function (err,data) {
        if (err) {
            return console.log(err);
        }

        less.render(data)
            .then(function(output) {
                console.log(output)
                // output.css = string of css
                // output.map = undefined
            }, function(error){
                console.log(error)
            })
    });

}

