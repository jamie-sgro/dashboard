// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function getPanel3Height() {
    //start with panel3 html height
    rtn = parseInt($("#panel3").css("height"));
    //reduce by padding in .css (if browser can detect it)
    var panel3Padding = parseInt($("#panel3").css("padding"));
    if (isNaN(panel3Padding)) {
        //hardcoded on firefox & ms edge
        rtn -= 20;
    }
    else {
        rtn -= panel3Padding * 2;
    }
    ;
    //reduce by text height if there's no table, else reduce by table height
    if ($("#leaflet").css("height") == undefined) {
        rtn -= parseInt($("#popupInfo").css("height"));
    }
    else {
        //reduce by header before table
        rtn -= parseInt($("#popupInfo").children().css("height"));
        //reduce by table
        rtn -= parseInt($("#leaflet").css("height"));
    }
    ;
    if (rtn > 0) {
        return rtn;
    }
    else {
        return 0;
    }
    ;
}
;
function updatePanel3(id) {
    return __awaiter(this, void 0, void 0, function () {
        var rawData, checkedRadio;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //update city id if applicable
                    if (id) {
                        document.getElementById("popupInfo").class = id;
                    }
                    else {
                        id = document.getElementById("popupInfo").class;
                    }
                    ;
                    return [4 /*yield*/, mark];
                case 1:
                    mark = _a.sent();
                    rawData = Data.getSyncData();
                    getMarkScore(mark, rawData, "score$" + getCheckedRadio());
                    checkedRadio = getCheckedRadio();
                    if (!mark[id].table[checkedRadio]) {
                        document.getElementById("popupInfo").innerHTML = "Could not retrieve city data.";
                        throw "Could not populate table based on button name. Please confirm whether button-name matches a .csv column\ni.e. A column named score$geometric should have a button named geometric";
                    }
                    else {
                        // populate table based on which button is currently presssed
                        document.getElementById("popupInfo").innerHTML = mark[id].table[checkedRadio];
                    }
                    ;
                    d3.select("#panel3").select("svg")
                        .attr("height", getPanel3Height());
                    //unhighlight previous marker
                    d3.select("#panel3").selectAll("rect")
                        .call(attrTween, 300, "fill", "#EFEFEF")
                        .on("mouseover", panel3MouseOver)
                        .on("mouseout", panel3MouseOut);
                    //highlight bar that matches the marker selected
                    d3.select("rect#id" + (mark[id].score[checkedRadio] - 1))
                        .on("mouseover", null)
                        .on("mouseout", null)
                        .call(attrTween, 300, "fill", "rgb(100,100,100)");
                    //replot graph if radio button is pressed
                    plotPanel3();
                    //update barplot.id
                    barplot.id = id;
                    return [2 /*return*/];
            }
        });
    });
}
;
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
        }
        ;
    }
    ;
    throw "no radio button pressed";
}
;
function getCheckboxes() {
    var checkArr = document.getElementsByName("checkbox-sdg");
    var checkList = [];
    for (var i = 0; i < checkArr.length; i++) {
        if (!checkArr[i].checked)
            continue;
        var sdgCleaned = checkArr[i].id.replace("checkbox-", "");
        checkList.push(sdgCleaned);
    }
    return checkList;
}
function panel3Resize() {
    pos = {};
    pos.top = ($(window).height() * (1 - panelHeight));
    if ($('#header').height()) {
        pos.top -= $('#header').height();
    }
    ;
    //hardcoded based on orig height of the elem
    pos.top += 50;
    pos.width = $(window).width() * (1 - panelWidth);
    pos.height = ($(window).height() * (panelHeight)) - 27;
    $("#panel3").css({
        top: pos.top,
        width: pos.width,
        height: pos.height
    });
    //set up svg bounds with padding for panel3 graph
    d3.select("#panel3").select("svg")
        .attr("width", "100%")
        .attr("height", getPanel3Height());
}
;
function panel3GetWidthScale() {
    var width = parseInt($("#panel3 svg").css("width"));
    return d3.scaleBand()
        .range([0, width])
        .padding(0)
        .domain(panel3Data.map(function (d) {
        return d.name;
    }));
}
;
function panel3GetHeightScale() {
    return d3.scaleLinear()
        .domain([0, d3.max(panel3Data, function (d) {
            return d.value;
        })])
        .range([getPanel3Height(), 0]);
}
;
/* @getAttr(d3object, oject)
  - constructor for reused attributes for d3 graph. All updates to common
    atrributes are stored in this single function for rapid updating
  - the attributes object should be an array of strings that match d3
    attributes
*/
function getAttr(path, attributes) {
    var height = getPanel3Height();
    var widthScale = panel3GetWidthScale();
    var heightScale = panel3GetHeightScale();
    for (key in attributes) {
        switch (attributes[key]) {
            case "width":
                path.attr("width", widthScale.bandwidth());
                break;
            case "height":
                path.attr("height", function (d) {
                    if (height - heightScale(d.value) > 0) {
                        return height - heightScale(d.value);
                    }
                    else {
                        return 0;
                    }
                    ;
                });
                break;
            case "x":
                path.attr("x", function (d) {
                    return widthScale(d.name);
                });
                break;
            case "y":
                path.attr("y", function (d) {
                    return heightScale(d.value);
                });
                break;
        }
        ;
    }
    ;
}
;
// Reduce json data for city and return only arary of sdg scores
function getScoreArray(data) {
    var scoreArray = [];
    checkBoxes = getCheckboxes();
    for (checkBox in checkBoxes) {
        scoreArray.push(Number(data[checkBoxes[checkBox]]));
    }
    return scoreArray;
}
function arithmetic(data) {
    if (data.length < 1)
        return 0;
    return data.reduce(function (a, b) { return a + b; }) / data.length;
}
function median(data) {
    if (data.length < 1)
        return 0;
    data.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(data.length / 2);
    if (data.length % 2)
        return data[half];
    return (data[half - 1] + data[half]) / 2.0;
}
function geometric(data) {
    if (data.length < 1)
        return 0;
    root = data.length;
    agg = data.reduce(function (a, b) { return a * b; });
    return Math.pow(agg, 1 / root);
}
function getAverageScore(data, averageType) {
    scoreArray = getScoreArray(data);
    var average;
    if (averageType == "score$arithmetic") {
        average = arithmetic;
    }
    else if (averageType == "score$median") {
        average = median;
    }
    else if (averageType == "score$geometric") {
        average = geometric;
    }
    else {
        throw ("Averaging method not supported: " + averageType);
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
    rtn = [];
    for (i in rawData) {
        var averageScore = getAverageScore(rawData[i], keyPhrase);
        rtn.push({
            name: rawData[i].name,
            value: averageScore
        });
    }
    ;
    //sort data in descending order
    rtn.sort(function (x, y) {
        return d3.descending(x.value, y.value);
    });
    return rtn;
}
;
//Ran first and once to get proper sizing
//  (uses dataset, but assumes values of 0)
function initPanel3() {
    return __awaiter(this, void 0, void 0, function () {
        var rawData, heightScale;
        return __generator(this, function (_a) {
            rawData = Data.getSyncData();
            panel3Data = panel3ParseData(rawData);
            heightScale = panel3GetHeightScale();
            d3.select("#panel3")
                .select("svg")
                .selectAll("rect")
                .data(panel3Data)
                .enter()
                .append("rect")
                .attr("id", function (d, i) {
                return "id" + i;
            })
                .call(this.getAttr, ["x", "width", "height"])
                .attr("y", function (d) {
                //assume no value until user prompt
                return heightScale(0);
            })
                .attr("fill", "#EFEFEF")
                .attr("stroke", "#D0CFD4")
                .on("click", function () {
                getMarkId(this.id);
            })
                .on("mouseover", panel3MouseOver)
                .on("mouseout", panel3MouseOut);
            return [2 /*return*/];
        });
    });
}
;
function panel3MouseOver() {
    d3.select(this)
        .attr("fill", "rgb(170,170,170)");
}
;
function panel3MouseOut() {
    d3.select(this)
        .attr("fill", "#EFEFEF");
}
;
function getMarkId(id) {
    return __awaiter(this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mark];
                case 1:
                    mark = _a.sent();
                    id = id.substring(2);
                    for (i in mark) {
                        if (mark[i].score[getCheckedRadio()] == Number(id) + 1) {
                            mark[Number(i)].fireEvent("click");
                            mark[Number(i)].closeTooltip();
                        }
                        ;
                    }
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
/* @plotPanel3()
  - redisplay graph with new data based on radio button score selected and
    current button selected
  - uses a motion tween with 800ms to resize rectangles
*/
function plotPanel3() {
    return __awaiter(this, void 0, void 0, function () {
        var rawData;
        return __generator(this, function (_a) {
            rawData = Data.getSyncData();
            panel3Data = panel3ParseData(rawData);
            d3.select("#panel3")
                .select("svg")
                .selectAll("rect")
                .data(panel3Data)
                .transition()
                .duration(800)
                .call(this.getAttr, ["x", "y", "width", "height"]);
            return [2 /*return*/];
        });
    });
}
;
/* @plotPanel3Resize()
  - ran on screen resize, moves graph to stay within the bounds of #panel3
    svg element. No delay or transiton for plot resize
*/
function plotPanel3Resize() {
    d3.select("#panel3")
        .select("svg")
        .selectAll("rect")
        .call(this.getAttr, ["x", "y", "width", "height"]);
}
;
