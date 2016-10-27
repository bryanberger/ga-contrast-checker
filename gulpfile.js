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
      var result = colorable(colors, {compact: true, threshold: 4.5});

      //Write the JSON and formatted CSV matrices to files.
      fs.writeFileSync('contrast.json', JSON.stringify(result, null, 2));
      fs.writeFileSync('contrast.csv', getCSV(result));
      fs.writeFileSync('contrast.html', getHTML(result));
      fs.writeFileSync('contrast2.html', getComplexHTML(result));

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
    var str = '<style>*{margin:0;padding:0;box-sizing:border-box;font-family:"Circular Std"</style>\r\n';
        str += '<h4 style="padding:1em;text-align:center;">Color combinations that meet the AA 4.5:1 contrast ratio</h4>\r\n';

    for (var i = 0; i < result.length; i++) {
        str += '<div style="width:100%; padding:1em; background-color:'+result[i].hex+';">';

        for (var x = 0; x < result[i].combinations.length; x++) {
          var dict = result[i].combinations[x].accessibility;

          if(dict['aa']) {
            str += '<div style="border-radius:4px; height:30px; padding:0.25rem 0.5rem; margin-right:0.5rem; display:inline-block; color:'
                + result[i].hex + '; background-color:' + result[i].combinations[x].hex + '">'+result[i].combinations[x].hex+'</div>';
          }

          // if(dict['aaLarge']) {
          //   str += '<div style="border-radius:4px; padding:0.25rem 0.5rem; margin-right:0.5rem; display:inline-block; color:' + result[i].hex + '; background-color:' + result[i].combinations[x].hex + '">AA Large</div>';
          // }
        }

        str += '</div>\r\n';
    }

    return str;
}

//Convert the Colorable JSON object to a hacky complex HTML page
function getComplexHTML(result) {
    var str = '<style>*{margin:0;padding:0;box-sizing:border-box;font-family:"Circular Std"</style>\r\n';
        str += '<h4 style="padding:1em;text-align:center;">Color combinations that meet the AA 4.5:1 contrast ratio</h4>\r\n';

    for (var i = 0; i < result.length; i++) {
      var color = result[i];
      var combos = result[i].combinations;

      str += '<div style="overflow:hidden; clear:left; margin-bottom:2em; ">';
      str += '<div style="margin-left:1%; font-family:monospace; color: #666;">colors that pass on '+color.hex + '(' + color.name+')</div>';

      for (var x = 0; x < combos.length; x++) {
        var combo = combos[x];
        var dict = combo.accessibility;

        if(dict['aa']) {
          var bodyColor = combo.hex;

          str += '<div style="width:23%; margin: .5em 1%; background-color:'+color.hex+'; position:relative; padding:1em; float:left; overflow:hidden;">';
          str += '<div style="color:'+bodyColor+'; font-size:23px; font-weight:bold; margin-bottom:8px">Flatiron</div>';
          str += '<div style="margin-bottom:8px; color:'+combo.hex+'">GA New York City (East)</div>';
          str += '<div style="margin-bottom:8px; color:'+bodyColor+'">902 Broadway, Floor 4<br>New York, NY 10010</div>';
          str += '<div style="color:'+bodyColor+';">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce <a style="color:'+combo.hex+'" href="#">faucibus exinect</a> tincidunt. Aenean venenatis consectetur augue, eget blandit</div>';
          str += '<div style="margin-top:0.5em; color:'+bodyColor+'">'+combo.contrast.toFixed(2)+'</div>'
          str += '</div>';
        }
      }

      str += '</div>\r\n';
    }

    return str;
}
