import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bagItemSchema from "./bagItem.schema";

const adminSchema = new Schema({
        user: {
            type: Types.ObjectId, ref: 'users'
        },
    },
    {timestamps: false,});

adminSchema.plugin(uniqueValidator);

export default adminSchema;
