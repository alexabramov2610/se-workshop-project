import {ProductCategory} from "./Enums";
export {ProductCategory}
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

export interface Purchase {
    item: Item,
    price: number;
}

export interface ProductWithQuantity extends ProductCatalogNumber {
    quantity: number
}