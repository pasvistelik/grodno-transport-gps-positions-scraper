"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _provider = require("../lib/provider");

var _provider2 = _interopRequireDefault(_provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var provider = new _provider2.default(); //var Provider = require("../lib/provider");
//console.log(Provider);
//var provider = new Provider();

var simpleRoutesForTest = [{ type: "bus", number: "1" }, { type: "bus", number: "2" }];
(0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return provider.initialize(simpleRoutesForTest, 2000);

                case 2:

                    setInterval(function () {
                        var vehicles = provider.getVehicles();
                        for (var i = 0, n = vehicles.length, vehicle = vehicles[0]; i < n; vehicle = vehicles[++i]) {
                            console.log("Vehicle " + vehicle.localId + ": " + vehicle.route.type + " " + vehicle.route.number + ", coords: lat= " + vehicle.lat + ", lng=" + vehicle.lng);
                        }
                        console.log();
                    }, 2000);

                case 3:
                case "end":
                    return _context.stop();
            }
        }
    }, _callee, this);
}))();
