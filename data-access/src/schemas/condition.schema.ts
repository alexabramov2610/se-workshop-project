import {Schema} from "mongoose";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";

const conditionSchema = new Schema({
        operator: {
            type: String,
            required: true
        },
        minPay: {
            type: Number,
        },
        minAmount: {
            type: Number,
        },
        catalogNumber: {
            type: Number,
        },
    },
    {timestamps: false,})

export default conditionSchema;
