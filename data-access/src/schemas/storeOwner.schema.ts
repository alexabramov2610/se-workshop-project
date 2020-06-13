import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import storeManagerSchema from "./storeManager.schema";

const storeOwnerSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        managersAssigned: {
            type: [{type: Schema.Types.Mixed, ref: 'storeManagers'}],
            required: true,
            default: []
        },
        ownersAssigned: {
            type: [{type: Schema.Types.Mixed, ref: 'storeOwners'}],
            required: true,
            default: []
        },
        agreements: {
            type: [{type: Types.ObjectId, ref: 'assignAgreements'}],
            default: []
        },
    },
    {timestamps: false,});

storeOwnerSchema.plugin(uniqueValidator);

export default storeOwnerSchema;
