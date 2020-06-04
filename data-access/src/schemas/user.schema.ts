import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bagItemSchema from "./bagItem.schema";

const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        cart: {
            type: Map,
            of: [bagItemSchema],
            required: true,
            default: new Map()
        },
        receipts: {
            type: [{type: Types.ObjectId, ref: 'receipts'}],
            required: true,
            default: []
        },
        pendingEvents: {
            type: [{type: Types.ObjectId, ref: 'events'}],
            required: true,
            default: []
        },
    },
    {timestamps: false,});

userSchema.plugin(uniqueValidator);

export default userSchema;
