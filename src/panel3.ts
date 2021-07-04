// @ts-expect-error
import d3 = require("d3");
// @ts-expect-error
import L = require("leaflet")

import { attrTween } from "./Barplot.js";
import { Data, DataModel, DataPoint } from "./Data.js";
import { barplot, mark, panelHeight, panelWidth } from "./main.js";
import { updateAllGraphs } from "./map.js";

let panel3Data: any

function getPanel3Height() {
  //start with panel3 html height
  let rtn = parseInt($("#panel3").css("height"));

  //reduce by padding in .css (if browser can detect it)
  var panel3Padding = parseInt($("#panel3").css("padding"));
  if (isNaN(panel3Padding)) {
    //hardcoded on firefox & ms edge
    rtn -= 20;
  } else {
    rtn -= panel3Padding * 2;
  };

  //reduce by text height if there's no table, else reduce by table height
  if ($("#leaflet").css("height") == undefined) {
    rtn -= parseInt($("#popupInfo").css("height"));
  } else {
    //reduce by header before table
    rtn -= parseInt($("#popupInfo").children().css("height"));
    //reduce by table
    rtn -= parseInt($("#leaflet").css("height"));
  };

  if (rtn > 0) {
    return rtn;
  } else {
    return 0;
  };
};



export function updatePanel3(id) {
  //update city id if applicable
  if (id) {
    // @ts-ignore
    document.getElementById("popupInfo").class = id;
  } else {
    // @ts-ignore
    id = document.getElementById("popupInfo").class
  };

  // mark = mark;
  let rawData = Data.getSyncData();

  getMarkScore(mark, rawData, "score$" + getCheckedRadio())

  var checkedRadio = getCheckedRadio();

  if (!mark[id].table[checkedRadio]) {
    document.getElementById("popupInfo").innerHTML = "Could not retrieve city data."
    throw "Could not populate table based on button name. Please confirm whether button-name matches a .csv column\ni.e. A column named score$geometric should have a button named geometric";
  } else {
    // populate table based on which button is currently presssed
    document.getElementById("popupInfo").innerHTML = mark[id].table[checkedRadio];
  };

  d3.select("#panel3").select("svg")
    .attr("height", getPanel3Height())

  //unhighlight previous marker
  d3.select("#panel3").selectAll("rect")
    .call(attrTween, 300, "fill", "#EFEFEF")
    .on("mouseover", panel3MouseOver)
    .on("mouseout", panel3MouseOut)

  //highlight bar that matches the marker selected
  d3.select("rect#id" + (mark[id].score[checkedRadio] - 1))
    .on("mouseover", null)
    .on("mouseout", null)
    .call(attrTween, 300, "fill", "rgb(100,100,100)")

  //replot graph if radio button is pressed
  plotPanel3()

  //update barplot.id
  barplot.id = id;
};


export class Mark extends L.CircleMarker {
  id: string
  table: {}
  score: {}
}


// take dataset and calculate metrics for the mark[i].table element
export function getMarkScore(mark: Mark[], data: DataModel[], scoreName: string) {
  //vet variable
  if (typeof(scoreName) != "string") {
    throw "Error in getMarkScore()\nscoreName variable must be a string matching a .csv header";
  };

  //get relative ranking
  var arr = [];
  for (let i in data) {
    arr.push(getAverageScore(data[i], scoreName));
  };
  var sorted = arr.slice().sort(function(a,b) {
    return b-a;
  });
  var rank = arr.slice().map(function(v){
    return sorted.indexOf(v) + 1;
  });

  //get average score between all cities
  var sum = 0;
  var avg = 0;
  if (arr.length) {
    sum = arr.reduce(function(a, b) {
      return a + b;
    });
    avg = sum / arr.length;
  }

  var standing;

  for (let i in data) {
    let city = data[i]
    //get relative standing
    standing = Math.round(((city[scoreName] / avg) - 1) * 100)

    if (standing > 0) {
      standing = "<font color='green'>&#x25B2;" + standing + "% above average</font>";
    } else if (standing < 0) {
      standing = "<font color='red'>&#x25BC;" + standing + "% below average</font>";
    } else {
      standing = "No average standing available";
    };

    if (mark[i].table == undefined) {
      mark[i].table = {};
      mark[i].score = {};
    };

    //get score type without the "score$"
    const jsonName = scoreName.substring(6);
    const averageRaw =  getAverageScore(city, scoreName);
    const average = Math.round(averageRaw * 100) / 100

    mark[i].table[jsonName] = generateTable(
      city.name, 
      average,
      rank[i] + " (of " + rank.length + ")", 
      standing);

    //record relative ranking for panel3 barchart selection
    mark[i].score[jsonName] = rank[i]
  };
};


function generateTable(name, score, rank, standing) {
  return `<h1 style="margin:0; padding:10">` + name + `</h1>
  <table style="width:100%; margin:0", id="leaflet">
    <tr>
      <th>Score</th>
      <th>Ranking</th>
      <th>Standing</th>
    </tr>
    <tr>
      <td>` + score + `</td>
      <td>` + rank + `</td>
      <td>` + standing + `</td>
    </tr>
  </table>`
};



/* @getCheckedRadio()
  - run through all elements named 'radio' to find first one that is checked.
    return the string of the button name, else throw error
*/
function getCheckedRadio() {
  var buttonArr = document.getElementsByName("radio");
  for (var i = 0; i < buttonArr.length; i++) {
    //check if checked
    if ($("input[id=" + buttonArr[i].id + "]:checked").length) {
      return buttonArr[i].id;
    };
  };
  throw "no radio button pressed";
};



function getCheckboxes() {
  let checkArr = document.getElementsByName("checkbox-sdg");
  let checkList = [];
  for (var i = 0; i < checkArr.length; i++) {
    // @ts-ignore
    if (!checkArr[i].checked) continue;
    let sdgCleaned = checkArr[i].id.replace("checkbox-", "");
    checkList.push(sdgCleaned);
  }
  return checkList;
}

class Pos{
  top: number;
  width: number;
  height: number;
}

export function panel3Resize() {
  let pos = new Pos;
  pos.top = ($(window).height()*(1-panelHeight));

  if ($('#header').height()) {
    pos.top -= $('#header').height();
  };

  //hardcoded based on orig height of the elem
  pos.top += 50;

  pos.width = $(window).width() * (1-panelWidth);

  pos.height = ($(window).height()*(panelHeight)) - 27;

  $("#panel3").css({
    top: pos.top,
    width: pos.width,
    height: pos.height
  });

  //set up svg bounds with padding for panel3 graph
  d3.select("#panel3").select("svg")
    .attr("width", "100%")
    .attr("height", getPanel3Height())
};



function panel3GetWidthScale() {
  var width = parseInt($("#panel3 svg").css("width"))

  return d3.scaleBand()
    .range([0, width])
    .padding(0)
    .domain(panel3Data.map(function(d) {
      return d.name;
    }))
};



function panel3GetHeightScale() {
  return d3.scaleLinear()
    .domain([0, Number(d3.max(panel3Data, function(d: DataPoint) {
      return d.value
    }))])
    .range([getPanel3Height(), 0]);
};



/* @getAttr(d3object, oject)
  - constructor for reused attributes for d3 graph. All updates to common
    atrributes are stored in this single function for rapid updating
  - the attributes object should be an array of strings that match d3
    attributes
*/
function getAttr(path, attributes) {
  var height = getPanel3Height()

  var widthScale = panel3GetWidthScale();
  var heightScale = panel3GetHeightScale();

  for (let key in attributes) {
    switch (attributes[key]) {
      case "width":
        path.attr("width", widthScale.bandwidth())
        break;
      case "height":
        path.attr("height", function(d) {
          if (height - heightScale(d.value) > 0) {
            return height - heightScale(d.value);
          } else {
            return 0;
          };
        })
        break;
      case "x":
        path.attr("x", function(d) {
          return widthScale(d.name);
        })
        break;
      case "y":
        path.attr("y", function(d) {
          return heightScale(d.value);
        })
        break;
    };
  };
};

// Reduce json data for city and return only arary of sdg scores
function getScoreBasedOnUserToggle(data): number[] {
  let scoreArray = []
  let checkBoxes = getCheckboxes();
  for (let checkBox in checkBoxes) {
    scoreArray.push(Number(data[checkBoxes[checkBox]]));
  }
  return scoreArray;
}

function getScore(data): number[] {
  let scoreArray = []
  for (let key in data) {
    // TODO: Make sure we only get valid scores
    if (key === "name") continue;
    scoreArray.push(Number(data[key]));
  }
  return scoreArray;
}


function arithmetic(data) {
  if (data.length < 1) return 0;
  return data.reduce((a, b) => a + b) / data.length;
}



function median(data){
  if(data.length < 1) return 0;

  data.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(data.length / 2);

  if (data.length % 2)
    return data[half];

  return (data[half - 1] + data[half]) / 2.0;
}


function geometric(data){
  if (data.length < 1) return 0;
  let root = data.length
  let agg = data.reduce((a, b) => a * b);
  return Math.pow(agg, 1/root);
}



export function getAverageScore(data, averageType) {
  let scoreArray = getScore(data);
  let average;
  if (averageType == "score$arithmetic")  {
    average = arithmetic;
  } else if (averageType == "score$median") {
    average = median;
  } else if (averageType == "score$geometric") {
    average = geometric;
  } else {
    throw("Averaging method not supported: " + averageType);
  }
  return average(scoreArray);
}



/* @panel3ParseData(array)
  - take full .csv dataset (an array of JSON objects) and reduces the list to
    just the name and score (given the current radio button selected)
  - sorts the new reduced list in descending order given the req of the graph
*/
function panel3ParseData(rawData) {
  var keyPhrase = "score$" + getCheckedRadio();

  //parse needed data from rawData
  let rtn = [];
  for (let i in rawData) {
    let averageScore = getAverageScore(rawData[i], keyPhrase);
    rtn.push({
      name: rawData[i].name,
      value: averageScore
    });
  };

  //sort data in descending order
  rtn.sort(function(x, y) {
    return d3.descending(x.value, y.value);
  });

  return rtn;
};



//Ran first and once to get proper sizing
//  (uses dataset, but assumes values of 0)
export function initPanel3() {
  let rawData = Data.getSyncData();

  panel3Data = panel3ParseData(rawData);
  var heightScale = panel3GetHeightScale();

  d3.select("#panel3")
    .select("svg")
      .selectAll("rect")
        .data(panel3Data)
        .enter()
        .append("rect")
          .attr("id", function(d, i) {
            return "id" + i;
          })
          .call(getAttr, ["x", "width", "height"])
          .attr("y", function(d) {
            //assume no value until user prompt
            return heightScale(0);
          })
          .attr("fill", "#EFEFEF")
          .attr("stroke", "#D0CFD4")
          .on("click", function() {
            getMarkId(this.id);
          })
          .on("mouseover", panel3MouseOver)
          .on("mouseout", panel3MouseOut)
};



function panel3MouseOver() {
  d3.select(this)
    .attr("fill", "rgb(170,170,170)");
};



function panel3MouseOut() {
  d3.select(this)
    .attr("fill", "#EFEFEF");
};



function getMarkId(id: string) {
  // parse `11` from "id11"
  id = id.substring(2);

  for (var i in mark) {
    if (mark[i].score[getCheckedRadio()] == Number(id)+1) {
      updateAllGraphs(Number(i))
    };
  };
};



/* @plotPanel3()
  - redisplay graph with new data based on radio button score selected and
    current button selected
  - uses a motion tween with 800ms to resize rectangles
*/
function plotPanel3() {
  let rawData = Data.getSyncData();
  panel3Data = panel3ParseData(rawData);

  d3.select("#panel3")
    .select("svg")
      .selectAll("rect")
        .data(panel3Data)
        .transition()
        .duration(800)
          .call(getAttr, ["x", "y", "width", "height"])
};



/* @plotPanel3Resize()
  - ran on screen resize, moves graph to stay within the bounds of #panel3
    svg element. No delay or transiton for plot resize
*/
export function plotPanel3Resize() {
  d3.select("#panel3")
    .select("svg")
      .selectAll("rect")
          .call(getAttr, ["x", "y", "width", "height"])
};
