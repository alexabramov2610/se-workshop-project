import { Product, CATEGORY } from "../../..";

export class ProductBuilder {
  private _p: Product;

  constructor() {
    this._p = {
      catalogNumber: 123,
      name: "default-product-name",
      category: CATEGORY.CLOTHING,
      price: 666,
    };
  }

  withPrice(price: number): ProductBuilder {
    this._p.price = price;
    return this;
  }

  withName(name: string): ProductBuilder {
    this._p.name = name;
    return this;
  }

  withCategory(cat: CATEGORY): ProductBuilder {
    this._p.category = cat;
    return this;
  }

  withCatalogNumber(num: number): ProductBuilder {
    this._p.catalogNumber = num;
    return this;
  }

  getProduct(): Product {
    return this._p;
  }
}
