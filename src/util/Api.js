import axios from 'axios';
import {
    // baseUrlDavid, 
    baseUrl, 
    // baseUrlNew,
    baseUrlReports, 
} from "../config/backend";

export const httpClient = axios.create({
    baseURL: baseUrl, //YOUR_API_URL HERE
    headers: {
        'Content-Type': 'application/json',
    },
});

export const httpClientReports = axios.create({
    baseURL: baseUrlReports, //YOUR_API_URL HERE
    headers: {
        'Content-Type': 'application/json',
    },
});