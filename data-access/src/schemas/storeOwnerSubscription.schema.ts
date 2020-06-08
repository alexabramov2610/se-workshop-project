import {Schema} from "mongoose";

const storeOwnerSubscriptionSchema = new Schema({
    storeName: {type: String, required: true},
    username: {type: String, required: true}
});

export default storeOwnerSubscriptionSchema;
