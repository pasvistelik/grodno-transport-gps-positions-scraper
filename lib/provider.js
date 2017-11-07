"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//ToDo: create and use this:... import binaryFind from 'binarySearch/lib/binaryFind';

var GrodnoPositionsScraper = function () {
    function GrodnoPositionsScraper() {
        _classCallCheck(this, GrodnoPositionsScraper);
    }

    _createClass(GrodnoPositionsScraper, [{
        key: "initialize",
        value: async function initialize(routesForAssotiating) {
            var updatingInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5000;

            this.associationsWithRoutes = [];

            // Берем все известные провайдеру маршруты:
            var grodnoRoutes = await getJsonFromUrl(_config2.default.apiGetRoutesUrl);

            // Строим ассоциации между нашими маршрутами и маршрутами провайдера:
            for (var routeObj in grodnoRoutes) {
                var routeType = null;
                if (routeObj.type === "А") routeType = "bus";else {
                    console.log("Нераспознанный тип маршрута (" + routeObj.type + "):");
                    console.log(routeObj);
                    continue;
                }

                var routeNum = routeObj.rnum;

                var findedRoute = null;
                for (var currentRoute in routesForAssotiating) {
                    if (currentRoute.number == routeNum && currentRoute.type == routeType) {
                        findedRoute = currentRoute;
                        break;
                    }
                }
                if (findedRoute == null) {
                    console.log("Нераспознанный маршрут:");
                    console.log(routeObj);
                    continue;
                }

                this.associationsWithRoutes[routeObj.rid] = findedRoute;
            }

            // Формируем URL запроса на получение местоположения транспорта:
            var reqRoutesIdsPart = "";
            for (var obj in this.associationsWithRoutes) {
                reqRoutesIdsPart += obj.rid + "-0,";
            }
            this.getPositionsUrl = _config2.default.apiGetPositionsUrlPart + reqRoutesIdsPart.slice(0, -1);
            this.grodnoVehicles = [];

            await this.updatePositions();

            console.log("Grodno-vehicles-provider was initialized.");

            setInterval(function () {
                this.updatePositions();
            }, updatingInterval);
        }
    }, {
        key: "getVehicles",
        value: function getVehicles() {
            return this.grodnoVehicles;
        }
    }, {
        key: "updatePositions",
        value: async function updatePositions() {
            var returnedVehicles = (await getJsonFromUrl(this.getPositionsUrl)).anims;
            for (var vehicle in returnedVehicles) {
                var currentVehicle = this.grodnoVehicles[vehicle.id];
                if (currentVehicle == null) {
                    currentVehicleRoute = this.associationsWithRoutes[vehicle.rid];
                    if (currentVehicleRoute == null) {
                        console.log("Не найдена связь с маршрутом: " + vehicle.rid);
                        continue;
                    }
                    currentVehicle = this.grodnoVehicles[vehicle.id] = {
                        route: currentVehicleRoute
                    };
                }
                currentVehicle.lat = vehicle.lat / 1000000;
                currentVehicle.lng = vehicle.lon / 1000000;
                currentVehicle.timestamp = vehicle.lasttime;
                currentVehicle.localId = vehicle.id;
                currentVehicle.speedInLastMoment = vehicle.speed;
                currentVehicle.way = null;
                currentVehicle.trip = null;
            }
        }
    }]);

    return GrodnoPositionsScraper;
}();

/////////////////////////////////////////////

function binaryFind(array, predicateForArrayItem) {
    var i = 0,
        j = array.length,
        k = void 0,
        predicateResult = void 0,
        currentItem = void 0;

    while (i < j) {
        k = ~~((i + j) / 2);
        currentItem = array[k];
        predicateResult = predicateForArrayItem(currentItem, k, array);

        if (predicateResult === 0) return currentItem;else if (predicateResult === 1) j = k;else i = k + 1;
    }
    return null;
}

async function getJsonFromUrl(strReq) {
    var response = await fetch(strReq);
    return await response.json();
}

/////////////////////////////////////////////

exports.default = GrodnoPositionsScraper;