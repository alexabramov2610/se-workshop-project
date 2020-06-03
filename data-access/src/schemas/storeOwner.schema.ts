import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const storeOwnerSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        managerAssigned: {
            type: [{type: Types.ObjectId, ref: 'storeManagers'}],
            required: true,
            default: []
        },
        ownerAssigned: {
            type: [{type: Types.ObjectId, ref: 'storeOwners'}],
            required: true,
            default: []
        },
    },
    {timestamps: false,});

storeOwnerSchema.plugin(uniqueValidator);

export default storeOwnerSchema;
