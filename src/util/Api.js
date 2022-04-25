import axios from 'axios';
import {baseUrlDavid} from "../config/backend";

export const httpClient = axios.create({
    baseURL: baseUrlDavid, //YOUR_API_URL HERE
    headers: {
        'Content-Type': 'application/json',
    },
});
