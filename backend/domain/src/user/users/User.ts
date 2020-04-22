import {Product,BagItem} from "../../api-ext/CommonInterface";
import {BoolResponse} from "../../api-ext/Response";	
import {errorMsg} from "../../api-int/Error";
import {RemoveFromCartRequest} from "../../api-ext/Request";
import {loggerW} from "../../api-int/Logger";
const logger = loggerW(__filename)


export abstract class User {

    private _cart: Map<string, BagItem[ ]>;

    constructor(){
        this._cart=new Map();
    }

    

    removeProductFromCart(req:RemoveFromCartRequest):void {
        const storeName=req.body.storeName;
        const amount=req.body.amount;
        const catalogNumber=req.body.catalogNumber;
        const storeCart:BagItem[]=this.cart.get(storeName);
        const oldBag: BagItem = storeCart.find((b) => b.product.catalogNumber === catalogNumber);
        const newBag = {product: oldBag.product, amount: oldBag.amount - amount}

        const filteredCart=storeCart.filter((b) => b.product.catalogNumber !== catalogNumber)
        if(newBag.amount>0){
             const newCart=filteredCart.concat(newBag);
            this.cart.delete(storeName);
            this._cart.set(storeName,newCart)
        }
        else{
            this.cart.delete(storeName); 
            filteredCart!=[]?this.cart.delete(storeName):this._cart
        }
    }


    saveProductToCart(storeName:string,product:Product,amount:number):void{
        logger.info(`saving ${amount} products to cart`)
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

    get cart(){
        return this._cart;
    }



}