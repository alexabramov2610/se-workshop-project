export interface Item extends ProductCatalogNumber{
    id: number
}

export interface ProductCatalogNumber {
    catalogNumber: number
}

export interface Product extends ProductCatalogNumber {
    name: string,
    price: number,
    category: ProductCategory
}

export interface ProductWithQuantity extends ProductCatalogNumber {
    quantity: number
}

export enum ProductCategory {
    General,
    Electronics,
    Hobbies,
    Home
}