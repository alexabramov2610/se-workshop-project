export const addKeys = (collection) => {
    return collection.map((item, index) => {
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
    return collection.map(item => item.replace(/' '/g, '_').toUpperCase());
};

