require('dotenv').config()

const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    historyLimit = 6;
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'lenguage': 'es'
        };
    }

    paramsOpenWeather(lat, lon) {
        return {
            lat,
            lon,
            units: 'metric',
            lang: 'es',
            appid: process.env.OPENWEATHER_KEY
        };
    }

    async ciudad(lugar = '') {

        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });
            const resp = await instance.get();

            return resp.data.features.map(place => ({
                id: place.id,
                name: place.place_name,
                lng: place.center[0],
                lat: place.center[1]
            }));
        } catch (error) {
            console.log(error);
            return []; // retornar los lugares
        }
    }

    async weather(place) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.paramsOpenWeather(place.lat, place.lng)
            });

            const resp = await instance.get();

            return {
                desc: resp.data.weather[0].description.yellow,
                temp: resp.data.main.temp,
                temp_min: resp.data.main.temp_min,
                temp_max: resp.data.main.temp_max,
            };
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    parseChoicesMap(mapsResult) {
        return mapsResult.map((place, i) => {
            const idx = `${i + 1}.`.green;

            return {
                value: place.id,
                name: `${idx} ${place.name}`
            }
        });
    }

    addHistory(place) {        
        if(this.historial.find(p => p.id === place.id)) return;
        
        this.historial.unshift(place);

        if(this.historial.length > this.historyLimit) {
            this.historial.pop();
        }
        
        this.saveDB();
    }

    saveDB() {
        const payload = {
            historial : this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        if(fs.existsSync(this.dbPath)) {
            const payload = JSON.parse(fs.readFileSync(this.dbPath, {encoding: 'utf-8'}));
            this.historial = payload.historial;
        }
    }
}

module.exports = Busquedas;