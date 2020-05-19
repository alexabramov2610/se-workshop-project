import axios from "axios"
import openSocket from 'socket.io-client';

const https = require('https');
let socket;
const initData = { body: { firstAdminName: "admin1", firstAdminPassword: "admin123" } }
const baseDomain = "https://localhost:4000"

const instance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    withCredentials: true,
    crossDomain: true,
    // https: true
});


async function init(cb) {
    return Promise.all([
        instance.get(`${baseDomain}/system/newtoken`),
        instance.get(`${baseDomain}/system/status`),
        instance.get(`${baseDomain}/system/healthcheck`)
    ]).then(values => cb({ token: values[0].data, status: values[1].data, isSystemUp: values[2].data.data.result }))
}

async function adminInit(firstAdminName, firstAdminPassword) {
    instance.post(`${baseDomain}/system/init`, { body: { firstAdminName, firstAdminPassword } }).then(({ data }) => {
    }).catch(e => console.log("cant init system", e))
}

async function register(username, password) {
    return instance.post(`${baseDomain}/users/register`,
        { body: { username, password } });
}

async function createStore(storeName, description) {
    return instance.post(`${baseDomain}/stores/createStore`,
        { body: { storeName, description } });
}

function startConnection(cb) {
    console.log("STARTING CONNECTION");
    openSocket("wss://localhost:8000/?name=alex")
}

async function login(username, password) {
    return instance.post(`${baseDomain}/users/login`, { body: { username, password } })
}

async function logout() {
    return instance.post(`${baseDomain}/users/logout`, {})
}

const getStores = async (offset = 0, limit = 4) => {
    return instance.get(`${baseDomain}/stores/getStores/?offset=${offset}&limit=${limit}`)
}

const getStoreProducts = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getProducts/?storeName=${storeName}`);

}
const search = async (req) => {
    return instance.post(`${baseDomain}/stores/search`, req);

}
const removeItemFromCart = async (req) => {
    return instance.post(`${baseDomain}/users/removeProduct`, req);

}
const getStoreCategories = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getCategories/?storeName=${storeName}`);
}

const addToCart = async (req) => {
    return instance.post(`${baseDomain}/users/saveProduct/`, req);
}

const viewCart = async () => {
    return instance.get(`${baseDomain}/users/viewCart/`);
}

const getDiscountPolicy = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getDiscountsPolicy/?storeName=${storeName}`);
}

const setDiscountPolicy = async (req) => {
    return instance.post(`${baseDomain}/stores/setDiscountsPolicy/`, req);
}

const getPersonalInfo = async (req) => {
    return instance.get(`${baseDomain}/users/personalDetails/`, req);
}

const viewPersonalPurchasesHistory = async (req) => {
    return instance.get(`${baseDomain}/users/viewRegisteredUserPurchasesHistory/`, req);
}

const viewStoreInfo = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getStoreInfo/?storeName=${storeName}`);
}
const viewProductInfo = async (storeName, catalogNumber) => {
    return instance.get(`${baseDomain}/stores/viewProductInfo/?storeName=${storeName}&catalogNumber=${catalogNumber}`);
}
const purchase = async (req) => {
    return instance.post(`${baseDomain}/stores/purchase/`, req);
}
export {purchase,viewProductInfo, removeItemFromCart, viewStoreInfo, viewPersonalPurchasesHistory, getPersonalInfo, viewCart, addToCart, setDiscountPolicy, getDiscountPolicy, startConnection, login, init, register, logout, getStores, createStore, getStoreProducts, adminInit, search, getStoreCategories };