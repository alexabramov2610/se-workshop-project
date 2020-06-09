import { createBrowserHistory } from 'history';
export let loggedInUser = undefined;
export let isInit = false;
export let isAdmin = false;

export const history = createBrowserHistory();

export const setLoggedInUser = (username) => {
    loggedInUser = username;
}

export const getLoggedInUser = () => {
    return loggedInUser;
}

export const admingSet = () => {
    isInit = !isInit;
}

export const setIsAdmin = (newIsAdmin) => {
    isAdmin = newIsAdmin;
}