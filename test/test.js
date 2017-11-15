//var Provider = require("../lib/provider");
//console.log(Provider);
//var provider = new Provider();

import GrodnoPositionsScraper from '../lib/provider';
var provider = new GrodnoPositionsScraper();

let simpleRoutesForTest = [{type: "bus", number: "1"},{type: "bus", number: "2"}];
(async function() {
    await provider.initialize(simpleRoutesForTest, 2000);
    
    setInterval(function(){
        let vehicles = provider.ejectUpdatedVehicles();
        for(let i = 0, n = vehicles.length, vehicle = vehicles[0]; i < n; vehicle = vehicles[++i]){
            console.log("Vehicle "+vehicle.localId+": "+vehicle.route.type+" "+vehicle.route.number+", coords: lat= "+vehicle.lat+", lng="+vehicle.lng+", date= "+vehicle.date);
        }
        console.log();
    }, 2000);
    
})();
