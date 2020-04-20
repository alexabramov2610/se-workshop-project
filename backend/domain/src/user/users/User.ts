import {Product} from "../../api-ext/CommonInterface";
import {BoolResponse} from "../../api-ext/Response";

export abstract class User {

    cart:Product[]

    constructor(){
        this.cart=[];
    }

    addProductToCart(product:Product):void{
        this.cart=this.cart.concat(product);
    }

    removeProductFromCart(product:Product):void{
        this.cart=this.cart.filter((p)=>{p.name!==product.name})
    }


}