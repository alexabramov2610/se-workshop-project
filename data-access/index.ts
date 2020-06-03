import "./src/config/database"
import UserModel from "./src/models/user_models/UserModel";
import StoreModel from "./src/models/store_models/StoreModel";
import BagItemModel from "./src/models/common_models/BagItemModel";
import ReceiptModel from "./src/models/common_models/ReceiptModel";
import StoreOwnerModel from "./src/models/user_models/StoreOwnerModel";
import StoreManagerModel from "./src/models/user_models/StoreManagerModel";
export {UserModel,StoreModel,BagItemModel,ReceiptModel,StoreOwnerModel,StoreManagerModel}
/*
async function register_test() {
    const newUser = new UserModel({name: "tal", password: "password1"})
    await newUser.save();
}

async function add_to_cart_test() {
    try {
        const user = await UserModel.findOne({name: "tal"})
        const storeName = "store1";
        const bagItem = await BagItemModel.create(({product: 1, amount:3, finalPrice: 5}))
        user.cart.set(storeName, bagItem);
        await user.save();
    } catch (e) {
        console.log(`cant find user`)
    }
}

async function get_cart_test() {
    try {
        const user = await UserModel.findOne({name: "tal"})
        console.log(user.cart.values())
        for(const [s,n] of user.cart){
            console.log(s)
            console.log(n)
            const bag =await BagItemModel.findById(n[0]);
            console.log(bag)
        }
    } catch (e) {
        console.log(e)
    }
}


async function add_receipt() {
    try {
        const user = await UserModel.findOne({name: "tal"})
        const storeName = "store1";
        const bagItem = await ReceiptModel.create(({date: 1, lastCC4:3, totalCharged: 5}))
        user.cart.set(storeName, bagItem);
        await user.save();
    } catch (e) {
        console.log(`cant find user`)
    }
}
//register_test().then((res) => console.log("added user tal")).catch(err => console.log("cant add user"))
//  add_to_cart_test().then(res=> console.log("updated cart"))
//get_cart_test().then(res=>console.log("done get cart"))

 */


