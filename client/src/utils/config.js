import { createBrowserHistory } from 'history';
export let loggedInUser = undefined;
export let isInit = false;

export const history = createBrowserHistory();

export const setLoggedInUser = (username) => {
    loggedInUser = username;
}

export const getLoggedInUser = (username) => {
    loggedInUser = username;
}


export const admingSet = () => {
    isInit = !isInit;
}