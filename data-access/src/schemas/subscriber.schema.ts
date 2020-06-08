import {Schema} from "mongoose";
import storeOwnerSubscriptionSchema from "./storeOwnerSubscription.schema";

const subscriberSchema = new Schema({
    storeOwners: {type: [storeOwnerSubscriptionSchema], required: true, default: []}
}, {autoCreate: true});

export default subscriberSchema;