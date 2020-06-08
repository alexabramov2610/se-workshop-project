import {Schema} from "mongoose";
import {ProductCategory} from "se-workshop-20-interfaces/dist/src/Enums";

const conditionSchema = new Schema({
        operator: {
            type: String,
            required: true
        },
        minPay: {
            type: Number,
            required: true
        },
        minAmount: {
            type: Number,
            required: true
        },
        catalogNumber: {
            type: Number,
            required: true
        },
    },
    {timestamps: false,})

export default conditionSchema;
