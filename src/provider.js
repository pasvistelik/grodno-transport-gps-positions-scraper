import ProviderConfig from './config';
//ToDo: create and use this:... import binaryFind from 'binarySearch/lib/binaryFind';

class GrodnoPositionsScraper{
    async initialize(routesForAssotiating, updatingInterval = 5000){
        this.associationsWithRoutes = [];

        // Берем все известные провайдеру маршруты:
        const grodnoRoutes = await getJsonFromUrl(ProviderConfig.apiGetRoutesUrl);

        // Строим ассоциации между нашими маршрутами и маршрутами провайдера:
        for (let routeObj in grodnoRoutes){
            let routeType = null;
            if (routeObj.type === "А") routeType = "bus";
            else {
                console.log("Нераспознанный тип маршрута ("+routeObj.type+"):");
                console.log(routeObj);
                continue;
            }

            let routeNum = routeObj.rnum;
           
            var findedRoute = null;
            for (let currentRoute in routesForAssotiating) {
                if (currentRoute.number == routeNum && currentRoute.type == routeType){
                    findedRoute = currentRoute;
                    break;
                }
            }
            if (findedRoute == null){
                console.log("Нераспознанный маршрут:");
                console.log(routeObj);
                continue;
            }

            this.associationsWithRoutes[routeObj.rid] = findedRoute;
        }

        // Формируем URL запроса на получение местоположения транспорта:
        let reqRoutesIdsPart = "";
        for (let obj in this.associationsWithRoutes){
            reqRoutesIdsPart += obj.rid + "-0,";
        }
        this.getPositionsUrl = ProviderConfig.apiGetPositionsUrlPart + reqRoutesIdsPart.slice(0, -1);
        this.grodnoVehicles = [];

        await this.updatePositions();

        console.log("Grodno-vehicles-provider was initialized.");

        setInterval(function(){
            this.updatePositions();
        }, updatingInterval);
    }

    getVehicles(){
        return this.grodnoVehicles;
    }

    async updatePositions(){
        let returnedVehicles = (await getJsonFromUrl(this.getPositionsUrl)).anims;
        for (let vehicle in returnedVehicles){
            let currentVehicle = this.grodnoVehicles[vehicle.id];
            if (currentVehicle == null){
                currentVehicleRoute = this.associationsWithRoutes[vehicle.rid];
                if (currentVehicleRoute == null){
                    console.log("Не найдена связь с маршрутом: "+vehicle.rid);
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
}



/////////////////////////////////////////////

function binaryFind(array, predicateForArrayItem)
{
    let i = 0, j = array.length, k, predicateResult, currentItem; 
                                 
    while (i < j){
        k = ~~((i+j)/2);
        currentItem = array[k];
        predicateResult = predicateForArrayItem(currentItem, k, array);

        if (predicateResult === 0) return currentItem;
        else if (predicateResult === 1) j = k;
        else i = k+1;
    }
    return null;
}

async function getJsonFromUrl(strReq) {
    var response = await fetch(strReq);
    return await response.json();
}

/////////////////////////////////////////////

export default GrodnoPositionsScraper;