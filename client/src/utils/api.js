import axios from "axios"
import openSocket from 'socket.io-client';

const https = require('https');
let socket;
let sessionToken;
const addToken = (req) => { return { body: req.body, sessionToken }; }
const initData = { body: { firstAdminName: "admin1", firstAdminPassword: "admin123" }, token: sessionToken }
const baseDomain = "http://localhost:5000"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});


async function init() {
    instance.post(`${baseDomain}/system/newtoken`, { body: {} }).then(({ data }) => {
        sessionToken = data;
    }).catch(e => console.log("cant fetch new token", e))
    instance.post(`${baseDomain}/system/init`, initData).then(({ data }) => {
    }).catch(e => console.log("cant init system", e))
}

async function register(username, password) {
    return instance.post(`${baseDomain}/users/register`,
        addToken({ body: { username, password } }));
}


function startConnection(cb) {
    openSocket("ws://localhost:8000/?name=alex")
}


async function login(username, password) {
    return instance.post(`${baseDomain}/users/login`, addToken({ body: { username, password } }))
}

async function logout() {
    return instance.post(`${baseDomain}/users/logout`, addToken({}))
}

const getStores = async (offset = 0, limit = 5) => {
    return axios.get(`${baseDomain}/stores/getStores/?offset=${offset}&limit=${limit}`)

}


export { startConnection, login, init, register, logout };