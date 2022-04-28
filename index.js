const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    const busquedas = new Busquedas();
    let opt = 0;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1: // Buscar ciudad
                const search = await leerInput('Ciudad:');
                const places = await busquedas.ciudad(search);
                const id = await listarLugares(busquedas.parseChoicesMap(places));
                const place = places.find(p => p.id === id);
                const weather = await busquedas.weather(place);

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', place.name);
                console.log('Latitud:', place.lat, 'º'.green);
                console.log('Longitud:', place.lng, 'º'.green);
                console.log('Temperatura:', weather.temp, 'ºC'.green);
                console.log('Mínima:', weather.temp_min, 'ºC'.green);
                console.log('Máxima:', weather.temp_max, 'ºC'.green);
                console.log('Tiempo:', weather.desc);

                busquedas.addHistory(place);

                break;
            case 2: // Historial
                const idHistory = await listarLugares(busquedas.parseChoicesMap(busquedas.historial));
                const placeHistory = busquedas.historial.find(p => p.id === idHistory);
                const weatherHistory = await busquedas.weather(placeHistory);

                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', placeHistory.name);
                console.log('Latitud:', placeHistory.lat, 'º'.green);
                console.log('Longitud:', placeHistory.lng, 'º'.green);
                console.log('Temperatura:', weatherHistory.temp, 'ºC'.green);
                console.log('Mínima:', weatherHistory.temp_min, 'ºC'.green);
                console.log('Máxima:', weatherHistory.temp_max, 'ºC'.green);
                console.log('Tiempo:', weatherHistory.desc);
                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0)
}

main().catch((error) => console.log(error));