export const parseConditions = (conditions) => {
    return conditions.reduce((acc, curr) => {
        const currDesc = curr.condition && curr.condition.minPay
            ? `store minimum subtotal: ${curr.condition.minPay} `
            : curr.condition && curr.condition.minAmount
                ? `minimum amount: ${curr.condition.minAmount} for product: ${curr.condition.catalogNumber} `
                : `on discount: ${curr.condition.catalogNumber} `;

        return [...acc, currDesc + curr.operator];
    }, []);
}

export const parseProducts = (products) => {
    const productsStrings = products.map(catalogNumber => catalogNumber + "");
    return productsStrings.join(", ");

}

