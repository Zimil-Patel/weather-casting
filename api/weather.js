import axios from 'axios';
import { apiKey } from '../constants/constants';

// Construct dynamic url
const forecastEndPoint = (props) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${props.cityName}&days=${props.days}&aqi=no&alerts=no`;
const locationEndPoint = (props) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${props.cityName}`;


// method to call api
const callApi = async (endpoint) => {

    const options = {
        method: 'GET',
        url: endpoint,
    };

    try{

        const response = await axios.request(options);

        if(response.status == 200){
            console.log("Successfully called....");
            return response.data;
        } else {
            console.log("Fetching failed!!!");
            return null;
        }


    } catch(e){
        console.log("Faild to call api!!! : ", e);
        return null;
    }

};


export const fetchForecastData = (props) => {
    return callApi(forecastEndPoint(props));
};

export const fetchLocationsData = (props) => {
    return callApi(locationEndPoint(props));
};