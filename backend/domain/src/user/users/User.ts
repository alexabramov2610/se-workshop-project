import {Product,BagItem} from "../../api-ext/CommonInterface";
import {BoolResponse} from "../../api-ext/Response";
import {errorMsg} from "../../api-int/Error";
import {RemoveFromCartRequest} from "../../api-ext/Request";
import {logger} from "../../api-int/Logger";


export abstract class User {

    private _cart: Map<string, BagItem[ ]>;

    constructor(){
        this._cart=new Map();
    }

    saveProductToCart(storeName:string,product:Product,amount:number):void{
        logger.info(`saving ${amount} products to allalalala to cart`)
        const storeCart:BagItem[]=this.cart.get(storeName);
        if(!storeCart){
            const newBag:BagItem={product,amount};
            this.cart.set(storeName,[newBag]);
            return
        }
        const oldBag= storeCart.find((b) => b.product.catalogNumber === product.catalogNumber)
        const newBag=oldBag?{product,amount:oldBag.amount + amount}:{product,amount}
        const newStoreCart=storeCart.filter((b) => b.product.catalogNumber === product.catalogNumber).concat(newBag);
        this.cart.set(storeName,newStoreCart)
    }

    removeProductFromCart(req:RemoveFromCartRequest):void {
        const storeName=req.body.storeName;
        const amount=req.body.amount;
        const catologNumber=req.body.catalogNumber;

        const storeCart:BagItem[]=this.cart.get(storeName);
        const oldBag: BagItem = storeCart.find((b) => b.product.catalogNumber === catologNumber);
        const newBag = {product: oldBag.product, amount: oldBag.amount - amount}

        storeCart.filter((b) => b.product.catalogNumber === catologNumber)
        if(newBag.amount>0){
            storeCart.concat(newBag);
        }

    }

    get cart(){
        return this._cart;
    }


}