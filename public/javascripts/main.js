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
/************************
*** DECLARE VARIABLES ***
************************/
var scl;
var markRad = 15;
var markCol = "rgba(10,151,217, .8)";
var colourBottom = "rgb(56, 94, 231)";
var colourTop = "rgb(34, 236, 87)";
var scaleToZoom = false;
//const locHost = "http://localhost:3000/"
var locHost = "https://www.sdsn-canada-dashboard.tk/";
var panelHeight = 0.40;
var panelWidth = 0.40;
//set default city
document.getElementById("popupInfo").class = 0;
/***************
*** GET DATA ***
***************/
// import .csv
function postAjax(url, data, callback) {
    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        url: url,
    }).done(function (data) {
        callback(null, data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        callback(jqXHR, null);
    });
}
;
function getData() {
    if (!getData.promise) {
        getData.promise = new Promise(function (resolve, reject) {
            postAjax(locHost + "getData", {}, function (err, cb) {
                if (err) {
                    console.log("Error: " + err.statusText);
                    console.log(err);
                    reject(err);
                    return;
                }
                ;
                resolve(cb.data);
            });
        });
    }
    ;
    return getData.promise;
}
;
/******************
*** ADD D3 TOOL ***
******************/
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
/*****************
*** CREATE MAP ***
*****************/
var map = getMap();
if (scaleToZoom) {
    scl = map.latLngToLayerPoint([0, 1]).x - map.latLngToLayerPoint([0, 0]).x;
}
else {
    scl = markRad;
}
L.svg().addTo(map);
var g = d3.select("#map").select("svg").append("g");
d3PopulateMarkers(map);
//DEPRECIATED
//move about d3PopulateMarkers() to use .d3 circle mouseEvents
mark = populateMarkers(map);
//set up alerts
map.on("click", onMapClick);
/*********************
*** MODIFY PANEL 3 ***
*********************/
//set up svg ahead so the modular function can select instead of append
d3.select("#panel3")
    .append("svg");
panel3Resize();
initPanel3();
/*********************
*** CREATE BARPLOT ***
*********************/
function getHeight() {
    if ($('#header').height()) {
        return $(window).height() - $('#header').height();
    }
    else {
        return $(window).height();
    }
    ;
}
;
//Barplot(width, height, margin)
var barplot = new Barplot(($(window).width() * panelWidth), getHeight(), { top: 10, right: 20, bottom: 30, left: 60 });
plotData();
//called once when the screen renders
function plotData() {
    return __awaiter(this, void 0, void 0, function () {
        var id, min, i, max, min;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getData()];
                case 1:
                    data = _a.sent();
                    barplot.max = getMaxScore(data);
                    id = document.getElementById("popupInfo").class;
                    dataArray = reduceData(data[id]);
                    barplot.id = id; //Currently use first row of .csv on graph init
                    min = [];
                    for (i in dataArray) {
                    }
                    ;
                    max = [];
                    min = [];
                    for (col in dataArray) {
                        max.push(getMax(data, dataArray[col].name));
                        min.push(getMin(data, dataArray[col].name));
                    }
                    barplot.plot(dataArray, min, max);
                    return [2 /*return*/];
            }
        });
    });
}
;
function getMaxScore(data) {
    maxScore = 0;
    for (rec in data) {
        for (key in data[rec]) {
            if (matches(key, ["name", "lat", "lng"]) == false) {
                if (key.substring(0, 5) != "score") {
                    if (Number(data[rec][key]) > Number(maxScore)) {
                        maxScore = data[rec][key];
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    return maxScore;
}
;
function getMax(arr, key) {
    var rtn;
    for (var i in arr) {
        if (rtn == undefined || rtn < Number(arr[i][key])) {
            rtn = Number(arr[i][key]);
        }
        ;
    }
    ;
    return rtn;
}
;
function getMin(arr, key) {
    var rtn;
    for (var i in arr) {
        if (rtn == undefined || rtn > Number(arr[i][key])) {
            rtn = Number(arr[i][key]);
        }
        ;
    }
    ;
    return rtn;
}
;
/*********************
*** DYNAMIC RESIZE ***
*********************/
//currently set to resize actively, but delays can be set so resize only occurs
//  at the end the end of screen change if barplot.resize() gets too costly
$(window).on("resize", function () {
    //update leaflet map
    mapResize();
    //update d3 barplot
    barplot.resize();
    //update panel3
    panel3Resize();
    plotPanel3Resize();
});
