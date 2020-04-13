export interface Item {
    id: number,
    catalogNumber: number
}

export interface ProductCatalogNumber {
    catalogNumber: number
}

export interface Product extends ProductCatalogNumber {
    name: string,
    price: number
}

export interface ProductWithQuantity extends ProductCatalogNumber {
    quantity: number
}
