import axios from 'axios';
import {baseUrlDavid, baseUrl, baseUrlNew} from "../config/backend";

export const httpClient = axios.create({
    baseURL: baseUrl, //YOUR_API_URL HERE
    headers: {
        'Content-Type': 'application/json',
    },
});
