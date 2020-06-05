import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import storeManagerSchema from "./storeManager.schema";

const storeOwnerSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        managersAssigned: {
            type: [storeManagerSchema],
            required: true,
            default: []
        },
        ownersAssigned: {
            type: [{type: Types.ObjectId, ref: 'storeOwners'}],
            required: true,
            default: []
        },
    },
    {timestamps: false,});

storeOwnerSchema.plugin(uniqueValidator);

export default storeOwnerSchema;
