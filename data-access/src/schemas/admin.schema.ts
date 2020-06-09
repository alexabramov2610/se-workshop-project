import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bagItemSchema from "./bagItem.schema";

const adminSchema = new Schema({
        user: { type: Types.ObjectId, ref: 'users', required: true},
    },
    {timestamps: false,}, {autoCreate: true});

adminSchema.plugin(uniqueValidator);

export default adminSchema;
