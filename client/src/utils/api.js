import axios from "axios";
import openSocket from "socket.io-client";

const https = require("https");
let socket;
const initData = {
    body: {firstAdminName: "admin1", firstAdminPassword: "admin123"},
};
const baseDomain = "https://localhost:4000";

const instance = axios.create({
    httpsAgent: new https.Agent({rejectUnauthorized: false}),
    withCredentials: true,
    crossDomain: true,
    // https: true
});

async function init(cb) {
    return Promise.all([
        instance.get(`${baseDomain}/system/newtoken`),
        instance.get(`${baseDomain}/system/status`),
        instance.get(`${baseDomain}/system/healthcheck`),
    ]).then((values) =>
        cb({
            token: values[0].data,
            status: values[1].data,
            isSystemUp: values[2].data.data.result,
        })
    );
}

async function adminInit(firstAdminName, firstAdminPassword) {
    instance
        .post(`${baseDomain}/system/init`, {
            body: {firstAdminName, firstAdminPassword},
        })
        .then(({data}) => {
        })
        .catch((e) => console.log("cant init system", e));
}

async function initFromFile() {
    return instance.get(
        `${baseDomain}/system/initFile`
    );
}

async function register(username, password) {
    return instance.post(`${baseDomain}/users/register`, {
        body: {username, password},
    });
}

async function createStore(storeName, description) {
    return instance.post(`${baseDomain}/stores/createStore`, {
        body: {storeName, description},
    });
}

function startConnection(cb) {
    console.log("STARTING CONNECTION");
    openSocket("wss://localhost:8000/?name=alex");
}

async function login(username, password, asAdmin) {
    return instance.post(`${baseDomain}/users/login`, {
        body: {username, password, asAdmin},
    });
}

async function logout() {
    return instance.post(`${baseDomain}/users/logout`, {});
}

async function getAllCategories() {
    return instance.get(
        `${baseDomain}/stores/getAllCategories`
    );
}

const getStores = async (offset = 0, limit = 4) => {
    return instance.get(
        `${baseDomain}/stores/getStores/?offset=${offset}&limit=${limit}`
    );
};

const getStoreProducts = async (storeName) => {
    return instance.get(
        `${baseDomain}/stores/getProducts/?storeName=${storeName}`
    );
};
const search = async (req) => {
    return instance.post(`${baseDomain}/stores/search`, req);
};
const removeItemFromCart = async (req) => {
    return instance.post(`${baseDomain}/users/removeProduct`, req);
};
const getStoreCategories = async (storeName) => {
    return instance.get(
        `${baseDomain}/stores/getCategories/?storeName=${storeName}`
    );
};

const addToCart = async (req) => {
    return instance.post(`${baseDomain}/users/saveProduct/`, req);
};

const viewCart = async () => {
    return instance.get(`${baseDomain}/users/viewCart/`);
};

const getDiscountPolicy = async (storeName) => {
    return instance.get(
        `${baseDomain}/stores/getDiscountsPolicy/?storeName=${storeName}`
    );
};

const setDiscountPolicy = async (req) => {
    return instance.post(`${baseDomain}/stores/setDiscountsPolicy/`, req);
};

const getPersonalInfo = async (req) => {
    return instance.get(`${baseDomain}/users/personalDetails/`, req);
};

const viewPersonalPurchasesHistory = async (req) => {
    return instance.get(
        `${baseDomain}/users/viewRegisteredUserPurchasesHistory/`,
        req
    );
};

const viewStoreInfo = async (storeName) => {
    return instance.get(
        `${baseDomain}/stores/getStoreInfo/?storeName=${storeName}`
    );
};
const viewProductInfo = async (storeName, catalogNumber) => {
    return instance.get(
        `${baseDomain}/stores/viewProductInfo/?storeName=${storeName}&catalogNumber=${catalogNumber}`
    );
};
const purchase = async (req) => {
    return instance.post(`${baseDomain}/stores/purchase/`, req);
};

const getPermissions = async (storeName) => {
    return instance.get(
        `${baseDomain}/stores/getManagerPermissions/?storeName=${storeName}`
    );
};

const addProduct = async (storeName, catalogNumber, name, price, category) => {
    const req = {
        body: {storeName, products: [{catalogNumber, name, price, category}]},
    };
    return instance.post(`${baseDomain}/stores/addNewProducts`, req);
};

const changeProductName = async (storeName, catalogNumber, newName) => {
    const req = {
        body: {storeName, catalogNumber, newName},
    };
    return instance.post(`${baseDomain}/stores/changeProductName`, req);
};

const changeProductPrice = async (storeName, catalogNumber, newPrice) => {
    const req = {
        body: {storeName, catalogNumber, newPrice},
    };
    return instance.post(`${baseDomain}/stores/changeProductPrice`, req);
};

const getManagersPermissions = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getManagersPermissions/?storeName=${storeName}`);
};

const updateManagersPermissions = async (req) => {
    console.log(req);
    return instance.post(`${baseDomain}/stores/updateManagersPermissions`, req);
};

const assignStoreManager = async (req) => {
    return instance.post(`${baseDomain}/stores/assignStoreManager`, req);
};

const removeStoreManager = async (req) => {
    return instance.post(`${baseDomain}/stores/removeStoreManager`, req);
};

const getOwnersAssignedByMe = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getOwnersAssignedBy/?storeName=${storeName}`);
};

const assignStoreOwner = async (req) => {
    return instance.post(`${baseDomain}/stores/assignStoreOwner`, req);
}

const removeStoreOwner = async (req) => {
    return instance.post(`${baseDomain}/stores/removeStoreOwner`, req);
}

const getStoreBuyingPolicy = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getPurchasePolicy/?storeName=${storeName}`);
}

const setStoreBuyingPolicy = async (req) => {
    return instance.post(`${baseDomain}/stores/setPurchasePolicy`, req);
}
const addItem = async (storeName, catalogNumber, id) => {
    const req = {body: {storeName: storeName, items: [{catalogNumber, id}]}}
    return instance.post(`${baseDomain}/stores/addItems`, req);
}
// stores/getItemIds/?storeName=alibaba&product=3
const getProductItems = async (storeName, cn) => {
    const {data} = await instance.get(`${baseDomain}/stores/getItemIds/?storeName=${storeName}&product=${cn}`);
    return data && data.data && data.data.items;
};

const removeItem = async (storeName, catalogNumber, id) => {
    const req = {body: {storeName: storeName, items: [{catalogNumber, id}]}}
    return instance.post(`${baseDomain}/stores/removeItems`, req);
};

const removeProduct = async (storeName, catalogNumber) => {
    const req = {body: {storeName: storeName, products: [{catalogNumber}]}}
    return instance.post(`${baseDomain}/stores/removeProducts`, req);
};

const viewStorePurchaseHistory = async (storeName) => {
    return instance.get(`${baseDomain}/stores/viewStorePurchasesHistory/?storeName=${storeName}`);
};

const viewUserPurchaseHistory = async (username) => {
    const req = {body: {userName: username}};
    return instance.post(`${baseDomain}/users/viewRegisteredUserPurchasesHistory`, req);
};

const getUsers = async () => {
    return instance.get(`${baseDomain}/users/allUsers`);
};

const getOwnersAssignedBy = async (storeName) => {
    return instance.get(`${baseDomain}/stores/getOwnersAssignedBy/?storeName=${storeName}`)
}

const approveStoreOwner = async (ownerName, storeName) => {
    const req = {body: { storeName: storeName, newOwnerName: ownerName }};
    return instance.post(`${baseDomain}/stores/approveStoreOwner`, req);
}

const getStatistics = (from, to) => {
    console.log(`${baseDomain}/system/getStatistics/?from=${from}&to=${to}`);
    return instance.get(`${baseDomain}/system/getStatistics/?from=${from}&to=${to}`)
}

const stopStatistics = () => {
    return instance.get(`${baseDomain}/system/stopStatistics/`)
}

const getStoresNames = (prefix, limit) => {
    
    return instance.get(`${baseDomain}/stores/getStoresNames/?prefix=${prefix}&limit=${limit}`)
}
const getProductsNames = (prefix, limit) => {
    return instance.get(`${baseDomain}/stores/getProductsNames/?prefix=${prefix}&limit=${limit}`)
}

export {
    stopStatistics,
    getStatistics,
    approveStoreOwner,
    getOwnersAssignedBy,
    getUsers,
    viewUserPurchaseHistory,
    viewStorePurchaseHistory,
    setStoreBuyingPolicy,
    getStoreBuyingPolicy,
    initFromFile,
    removeStoreOwner,
    assignStoreOwner,
    getOwnersAssignedByMe,
    removeStoreManager,
    assignStoreManager,
    updateManagersPermissions,
    getManagersPermissions,
    changeProductName,
    changeProductPrice,
    addProduct,
    getPermissions,
    purchase,
    viewProductInfo,
    removeItemFromCart,
    viewStoreInfo,
    viewPersonalPurchasesHistory,
    getPersonalInfo,
    viewCart,
    addToCart,
    setDiscountPolicy,
    getDiscountPolicy,
    startConnection,
    login,
    init,
    register,
    logout,
    getStores,
    createStore,
    getStoreProducts,
    adminInit,
    search,
    getStoreCategories,
    addItem,
    getProductItems,
    removeItem,
    removeProduct,
    getAllCategories,
    getStoresNames,
    getProductsNames
};
