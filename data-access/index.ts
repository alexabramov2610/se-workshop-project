import "./src/config/database"
import UserModel from "./src/models/user_models/UserModel";
import StoreModel from "./src/models/store_models/StoreModel";
import BagItemModel from "./src/models/common_models/BagItemModel";
import ReceiptModel from "./src/models/common_models/ReceiptModel";
import StoreOwnerModel from "./src/models/user_models/StoreOwnerModel";
import StoreManagerModel from "./src/models/user_models/StoreManagerModel";
import ProductModel from "./src/models/store_models/ProductModel";
import ItemModel from "./src/models/common_models/ItemModel";
import EventModel from "./src/models/common_models/EventModel";
import AdminModel from "./src/models/user_models/AdminModel";
import SystemModel from "./src/models/common_models/SystemModel";
import NotificationModel from "./src/models/common_models/NotificationModel";
import SubscriberModel from "./src/models/common_models/SubscriberModel";
import StoreOwnerSubscriptionModel from "./src/models/common_models/StoreOwnerSubscriptionModel"
import DiscountPolicyModel from "./src/models/store_models/DiscountPolicyModel";
import DiscountModel from "./src/models/store_models/DiscountModel";
import ConditionModel from "./src/models/store_models/ConditionModel";
import PurchasePolicyModel from "./src/models/store_models/PurchasePolicyModel";
import PurchasePolicyElementModel from "./src/models/store_models/PurchasePolicyElementModel";

export {
    PurchasePolicyModel,
    PurchasePolicyElementModel,
    ConditionModel,
    DiscountPolicyModel,
    DiscountModel,
    SubscriberModel,
    StoreOwnerSubscriptionModel,
    NotificationModel,
    AdminModel,
    UserModel,
    StoreModel,
    BagItemModel,
    ReceiptModel,
    StoreOwnerModel,
    StoreManagerModel,
    ProductModel,
    ItemModel,
    EventModel,
    SystemModel,

}
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


