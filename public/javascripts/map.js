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
var D3Map = /** @class */ (function () {
    function D3Map(width, height, margin) {
    }
    ;
    return D3Map;
}());
;
function mapResize() {
    h = ($(window).height() * (1 - panelHeight)) - 10;
    if ($('#header').height()) {
        h -= $('#header').height();
    }
    w = ($(window).width() * (1 - panelWidth));
    $("#map").height(h).width(w).css({ position: 'absolute' });
    map.invalidateSize();
}
;
function getMap() {
    map = L.map('map');
    map.setView([50, -87], 4);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
        maxZoom: 8,
        minZoom: 2,
    }).addTo(map);
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Legend</h4>";
        div.innerHTML += "<i style=\"background: " + colourBottom + "\"></i><span>Minimum Score</span><br>";
        div.innerHTML += "<i style=\"background: " + colourTop + "\"></i><span>Maximum Score</span><br>";
        return div;
    };
    legend.addTo(map);
    mapResize();
    map.doubleClickZoom.disable();
    return map;
}
;
function addMarker(map, name, lat, lng) {
    options = {
        radius: scl,
        stroke: false,
        color: "black",
        opacity: 1,
        fill: true,
        fillColor: "red",
        fillOpacity: 0,
    };
    var mark = L.circleMarker([lat, lng], options).addTo(map);
    mark.on("click", function () {
        //this is where hooks into .d3 should be made
        updateGraph(mark.id);
        //this is where hooks into panel 3 should be made
        updatePanel3(mark.id);
    });
    mark.on("mouseover", function () {
        //mark.setRadius(20);
    });
    mark.on("mouseout ", function () {
        //mark.setRadius(scl);
    });
    mark.bindTooltip(name, { direction: 'left' });
    mark.content = "<h1>name</h1>";
    mark.name = name;
    return (mark);
}
;
// take dataset and calculate metrics for the mark[i].table element
function getMarkScore(mark, data, scoreName) {
    //vet variable
    if (typeof (scoreName) != "string") {
        throw "Error in getMarkScore()\nscoreName variable must be a string matching a .csv header";
    }
    ;
    //get relative ranking
    var arr = [];
    for (i in data) {
        arr.push(getAverageScore(data[i], scoreName));
    }
    ;
    var sorted = arr.slice().sort(function (a, b) {
        return b - a;
    });
    var rank = arr.slice().map(function (v) {
        return sorted.indexOf(v) + 1;
    });
    //get average score between all cities
    var sum = 0;
    var avg = 0;
    if (arr.length) {
        sum = arr.reduce(function (a, b) {
            return a + b;
        });
        avg = sum / arr.length;
    }
    var standing;
    for (i in data) {
        var city = data[i];
        //get relative standing
        standing = Math.round(((city[scoreName] / avg) - 1) * 100);
        if (standing > 0) {
            standing = "<font color='green'>&#x25B2;" + standing + "% above average</font>";
        }
        else if (standing < 0) {
            standing = "<font color='red'>&#x25BC;" + standing + "% below average</font>";
        }
        else {
            standing = "No average standing available";
        }
        ;
        if (mark[i].table == undefined) {
            mark[i].table = {};
            mark[i].score = {};
        }
        ;
        //get score type without the "score$"
        jsonName = scoreName.substring(6);
        averageRaw = getAverageScore(city, scoreName);
        average = Math.round(averageRaw * 100) / 100;
        mark[i].table[jsonName] = generateTable(city.name, average, rank[i] + " (of " + rank.length + ")", standing);
        //record relative ranking for panel3 barchart selection
        mark[i].score[jsonName] = rank[i];
    }
    ;
}
;
function generateTable(name, score, rank, standing) {
    return "<h1 style=\"margin:0; padding:10\">" + name + "</h1>\n  <table style=\"width:100%; margin:0\", id=\"leaflet\">\n    <tr>\n      <th>Score</th>\n      <th>Ranking</th>\n      <th>Standing</th>\n    </tr>\n    <tr>\n      <td>" + score + "</td>\n      <td>" + rank + "</td>\n      <td>" + standing + "</td>\n    </tr>\n  </table>";
}
;
function populateMarkers(map) {
    return __awaiter(this, void 0, void 0, function () {
        var data, mark;
        return __generator(this, function (_a) {
            data = Data.getSyncData();
            mark = [];
            for (i in data) {
                //create marker element
                mark[i] = addMarker(map, data[i].name, data[i].lat, data[i].lng);
                //attach array number to JSON object
                mark[i].id = i;
            }
            ;
            /* get metrics to create table
                - run through .csv headers, if header starts with "score", calculate metrics
                  for that respective column
            */
            for (header in data[0]) {
                if (header.substring(0, 5) == "score") {
                    // header variable represents the full string of a column containing raw
                    //  score values
                    getMarkScore(mark, data, header);
                }
                ;
            }
            ;
            return [2 /*return*/, mark];
        });
    });
}
;
function onMapClick(e) {
    g.selectAll("circle")
        .each(function (d, i) {
        d3.select(this).call(attrTween, 500, "r", scl);
    });
    for (i in mark) {
        mark[i].setStyle({ radius: scl });
    }
    //center screen onClick
    $('html, body').animate({ scrollTop: $("#dashboard").offset().top }, 800);
}
;
/**********************
*** UPDATE BARCHART ***
**********************/
//updateGraph() is called when a leaflet marker is clicked
function updateGraph(id) {
    if (!id) {
        id = barplot.id;
    }
    ;
    updateMarker(id);
    var data = Data.getSyncData();
    dataArray = reduceData(data[id]);
    barplot.updatePlot(barplot.canvas, dataArray);
}
;
function updateMarker(id) {
    //reset pervious marker
    g.select("circle#id" + barplot.id)
        .call(attrTween, 800, "stroke", "white");
    //highlight new marker
    g.select("circle#id" + id)
        .moveToFront()
        .call(attrTween, 800, "stroke", "black");
}
;
/* @reduceData(object)
  - provide JSON object, removes data not used in graph visualization (i.e name
    and coordinates) and returns an array ready for d3 to use.
*/
function reduceData(data) {
    rtn = [];
    for (key in data) {
        if (matches(key, ["name", "lat", "lng"]) == false) {
            if (key.substring(0, 5) != "score") {
                rtn.push({ "name": key, "value": data[key] });
            }
            ;
        }
        ;
    }
    ;
    return rtn;
}
;
/* @matches(string, object)
  - if any item in the array 'search' is the key string, return true, else false
*/
function matches(key, search) {
    for (i in search) {
        if (key == search[i]) {
            return true;
        }
        ;
    }
    ;
    return false;
}
;
function d3PopulateMarkers(map) {
    return __awaiter(this, void 0, void 0, function () {
        function mouseover(obj) {
            obj
                .style("cursor", "pointer")
                .transition()
                .duration(300)
                .style("opacity", .3);
        }
        function mouseout(obj) {
            obj
                .style("cursor", "default")
                .transition()
                .duration(600)
                .style("opacity", 1);
        }
        function update() {
            if (scaleToZoom) {
                //get pxl distance between two coords
                x1 = map.latLngToLayerPoint([0, 1]).x;
                x2 = map.latLngToLayerPoint([0, 0]).x;
                scl = (x1 - x2);
            }
            g.selectAll("circle")
                .attr("r", scl)
                .attr("transform", function (d) {
                return "translate(" +
                    map.latLngToLayerPoint([d.lat, d.lng]).x + "," +
                    map.latLngToLayerPoint([d.lat, d.lng]).y + ")";
            });
            for (i in mark) {
                mark[i].setStyle({ radius: scl });
            }
            ;
        }
        var data;
        return __generator(this, function (_a) {
            data = Data.getSyncData();
            g.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("id", function (d, i) {
                return "id" + i;
            })
                .attr("r", 0)
                .attr("cx", function (d) {
                // layerPointToLatLng() ran on second monitor with coords from dataset
                // (the variable 'd') returns uncaught promise
                // - relies on update() function to properly init coordinates
                // - currently throw a dummy coordinate [0, 0]
                return map.layerPointToLatLng([0, 0]).x;
            })
                .attr('cy', function (d) {
                return map.layerPointToLatLng([0, 0]).y;
            })
                .attr("stroke", "white")
                .attr("stroke-width", 1)
                .attr("fill", markCol)
                .attr("pointer-events", "visible")
                .on("mouseover", function () {
                var myCol = d3.select(this).attr("fill");
                d3.select(this)
                    .style("cursor", "pointer")
                    .call(attrTween, 100, "fill", setAlpha(myCol, .4));
            })
                .on("mouseout", function () {
                var myCol = d3.select(this).attr("fill");
                d3.select(this)
                    .style("cursor", "default")
                    .call(attrTween, 100, "fill", setAlpha(myCol, 1));
            });
            map.on("zoomend", update);
            update();
            ;
            return [2 /*return*/];
        });
    });
}
;
