//Go fetch a reference to the task runner
  var gulp = require("gulp");

  //Go fetch a reference to the colorable module
  var colorable = require("colorable");

  //As we are writing files we need to fetch the file system module
  var fs = require("fs");

  //Define a task for gulp to calculate our colour matrix
  gulp.task("contrast", function () {

      //Our palette
      var colors = JSON.parse(fs.readFileSync('./colors.json'));

      //Calculate the accessible colours based on a ratio of 3:1 as
      //specified by the WCAG. This returns a JSON object with the
      //accessible colour combinations
      var result = colorable(colors, {compact: true, threshold: 3});

      //Write the JSON and formatted CSV matrices to files.
      fs.writeFileSync('contrast.json', JSON.stringify(result, null, 2));
      fs.writeFileSync('contrast.csv', getCSV(result));
      fs.writeFileSync('contrast.html', getHTML(result));

  });

//Convert the Colorable JSON object to CSV format
function getCSV(result) {
    var str = '';

    for (var i = 0; i < result.length; i++) {
        str = str + result[i].name +'(' + result[i].hex + ')';

        for (var x = 0; x < result[i].combinations.length; x++) {
            str = str + ',' + result[i].combinations[x].name + '(' + result[i].combinations[x].hex + ')';
        }

        str = str + '\r\n';
    }

    return str;
}

//Convert the Colorable JSON object to a hacky HTML page
function getHTML(result) {
    var str = '<style>*{margin:0;padding:0;box-sizing:border-box;font-family:"Circular Std"</style>';

    for (var i = 0; i < result.length; i++) {
        str += '<div style="width:100%; padding:1em; background-color:'+result[i].hex+';">';

        for (var x = 0; x < result[i].combinations.length; x++) {
          var dict = result[i].combinations[x].accessibility;

          if(dict['aa']) {
            str += '<div style="border-radius:4px; padding:0.25rem 0.5rem; margin-right:0.5rem; display:inline-block; color:' + result[i].hex + '; background-color:' + result[i].combinations[x].hex + '">AA</div>';
          }

          if(dict['aaLarge']) {
            str += '<div style="border-radius:4px; padding:0.25rem 0.5rem; margin-right:0.5rem; display:inline-block; color:' + result[i].hex + '; background-color:' + result[i].combinations[x].hex + '">AA Large</div>';
          }
        }

        str += '</div>\r\n';
    }

    return str;
}
