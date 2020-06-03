import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const storeManagerSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        managerPermissions: {
            type: [{type: Types.ObjectId, ref: 'permissions'}],
            required: true,
            default: []
        },
    },
    {timestamps: false,});

storeManagerSchema.plugin(uniqueValidator);

export default storeManagerSchema;
