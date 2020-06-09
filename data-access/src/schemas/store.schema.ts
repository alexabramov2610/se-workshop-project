import { Schema,Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import {Rating} from "se-workshop-20-interfaces/dist/src/Enums";

const storeSchema = new Schema({
        storeName: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        products: {
            type: [{type: Schema.Types.ObjectId, ref: 'products'}],
            required: true,
            default: []
        },
        storeOwners: {
            type: [{type: Types.ObjectId, ref: 'storeOwners'}],
            required: true,
            default: []
        },
        storeManagers: {
            type: [{type: Types.ObjectId, ref: 'storeManagers'}],
            required: true,
            default: []
        },
        receipts: {
            type: [{type: Types.ObjectId, ref: 'receipts'}],
            required: true,
            default: []
        },
        firstOwner: {
            type: Types.ObjectId,
            ref: 'storeOwners',
            required: true,
        },
        purchasePolicy: {
            type: Types.ObjectId, ref: 'purchasePolicies',
        },
        discountPolicy: {
            type: Types.ObjectId, ref: 'discountPolicies',
        },
        rating: {type: Number, enum: Object.values(Rating), default: 3},
},
    {timestamps: false,}
);

storeSchema.plugin(uniqueValidator);

export default storeSchema;
