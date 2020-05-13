import axios from 'axios';

const baseUrl = 'http://localhost:5000';
const headers = {'Access-Control-Allow-Origin': '*'}

export default axios.create({
    baseURL: baseUrl,
    timeout: 1000,
    headers: headers
});