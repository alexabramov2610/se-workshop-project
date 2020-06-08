import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import discountSchema from "./discount.schema";

const discountPolicySchema = new Schema({
        children: {
            type: [discountSchema],
        },
        storeName: {type: String}
    },
    {timestamps: false,})

discountPolicySchema.plugin(uniqueValidator);

export default discountPolicySchema;
