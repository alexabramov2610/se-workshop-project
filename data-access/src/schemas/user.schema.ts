import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

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
        of: Number,
        required: true
    },
},
    {timestamps:false, });

userSchema.plugin(uniqueValidator);

export default userSchema;
