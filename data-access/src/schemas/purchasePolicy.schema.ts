import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import discountSchema from "./discount.schema";
import purchasePolicyElementSchema from "./purchasePolicyElement.schema";

const purchasePolicySchema = new Schema({
        children: {
            type: [purchasePolicyElementSchema],
        },
        storeName: {type: String, unique:true}
    },
    {timestamps: false,})

purchasePolicySchema.plugin(uniqueValidator);

export default purchasePolicySchema;
