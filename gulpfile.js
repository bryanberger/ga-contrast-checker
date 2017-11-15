//Go fetch a reference to the task runner
  var gulp = require("gulp");

  //Go fetch a reference to the colorable module
  var colorable = require("colorable");

  //As we are writing files we need to fetch the file system module
  var fs = require("fs");

  //Define a task for gulp to calculate our colour matrix
  gulp.task("default", function () {

      //Our palette
      var colors = JSON.parse(fs.readFileSync('./colors.json'));

      //Calculate the accessible colours based on a ratio of 3:1 as
      //specified by the WCAG. This returns a JSON object with the
      //accessible colour combinations
      var result = colorable(colors, {compact: true, threshold: 0});

      //Write the JSON and formatted CSV matrices to files.
      fs.writeFileSync('build/contrast.json', JSON.stringify(result, null, 2));
      fs.writeFileSync('build/contrast.csv', getCSV(result));
      fs.writeFileSync('build/contrast.html', getHTML(result));
      // fs.writeFileSync('build/contrast2.html', getComplexHTML(result));

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
function getHTML(result, threshold) {
  // css and header
    var str =  '<link rel="stylesheet" href="../assets/css/main.css">\r\n';
        str += '<link rel="stylesheet" href="../assets/css/tooltip.css">\r\n';
        str += '<div><ul>';
        str += '<li><span>AA</span> - greater than 4.5 (for normal sized text)</li>';
        str += '<li><span>AA Large</span> - greater than 3 (for bold text or text larger than 24px)</li>';
        str += '<li><span>AAA</span> - greater than 7</li>';
        str += '<li><span>AAA Large</span> - greater than 4.5</li>';
        str += '</ul></div>\r\n';

    for (var i = 0; i < result.length; i++) {
      str += '<div class="strip" style="background-color:'+result[i].hex+';">';
      str += '<small>bg: '+result[i].name+' ('+result[i].hex+')</small> ';
      str += '<table>';
      str +=   '<tr>';
      str +=      '<th>AA</th>';
      str +=      '<th>AA Large</th>';
      str +=      '<th>AAA</th>';
      str +=      '<th>AAA Large</th>';
      str +=   '</tr>';

      for (var x = 0; x < result[i].combinations.length; x++) {
        var dict = result[i].combinations[x].accessibility;
        var resultObj = result[i];
        var aaStr = '';
        var aaLargeStr = '';
        var aaaStr = '';
        var aaaLargeStr = '';

        if(dict['aa']) {
          aaStr += createColorDiv(resultObj, x)
        }

        if(dict['aaLarge']) {
          aaLargeStr += createColorDiv(resultObj, x)
        }

        if(dict['aaa']) {
          aaaStr += createColorDiv(resultObj, x)
        }

        if(dict['aaaLarge']) {
          aaaLargeStr += createColorDiv(resultObj, x)
        }

        if(aaStr !== '' && aaLargeStr !== '' && aaStr !== '' && aaLargeStr !== '') {
          str +=   '<tr>';
          str +=      '<td>' + aaStr + '</td>';
          str +=      '<td>' + aaLargeStr + '</td>';
          str +=      '<td>' + aaaStr + '</td>';
          str +=      '<td>' + aaaLargeStr + '</td>';
          str +=   '</tr>';
        }
      } // end 2nd loop

      str +=  '</table>';
      str += '</div>\r\n';
    } // end first loop

    return str;
}

function createColorDiv(resultObj, x) {
  return '<div class="tooltip" data-tooltip="'+resultObj.combinations[x].name+'" style="color:'
      + resultObj.hex + '; background-color:' + resultObj.combinations[x].hex + '">'+resultObj.combinations[x].hex+'</div>';
}

//Convert the Colorable JSON object to a hacky complex HTML page
function getComplexHTML(result, threshold) {
    var str = '<style>*{margin:0;padding:0;box-sizing:border-box;font-family:"Circular Std";}</style>\r\n';
        str += '<h4 style="padding:1em;text-align:center;">Color combinations that meet the AA ' + threshold + ' contrast ratio</h4>\r\n';

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
          str += '<div style="margin-bottom:8px; font-weight: bold; color:'+combo.hex+'">GA New York City (East)</div>';
          str += '<div style="margin-bottom:8px; color:'+bodyColor+'">902 Broadway, Floor 4<br>New York, NY 10010</div>';
          str += '<div style="color:'+bodyColor+';">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce <a style="color:'+combo.hex+'" href="#">faucibus exinect</a> tincidunt. Aenean venenatis consectetur augue, eget blandit</div>';
          str += '<div style="margin-top:0.5em; color:'+bodyColor+'">'+combo.contrast.toFixed(2)+' | '+combo.hex+'</div>'
          str += '</div>';
        }
      }

      str += '</div>\r\n';
    }

    return str;
}
