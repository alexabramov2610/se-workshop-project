export const addKeys = (collection) => {
    if(!collection) return [];
    return collection && collection.map((item, index) => {
        return {key: index + "", ...item};
    });
}

export const addValueKey = (collection) => {
    return collection.map(item => {
        return {value: item};
    })
};

export const prettierCollection = (collection) => {
    return collection.map(item => item.replace(/_/g, ' ').toLowerCase());
};

export const uglierCollection = (collection) => {
    return collection.map(item => item.replace(/\s+/g, '_').toUpperCase());
};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

