import {Schema} from "mongoose";
import {WeekDays} from "se-workshop-20-interfaces/dist/src/Enums";

const purchasePolicyElementSchema = new Schema({
        operator: {
            type: String,
            required: true
        },
        notForSellDays: {
            type: [String],
            enum: Object.values(WeekDays),
        },
        catalogNumber: {
            type: Number,
        },
        minAmount: {
            type: Number,
        },
        maxAmount: {
            type: Number,
        },
        countries: {
            type: [String],
        },
        storeName: {type: String}
    },
    {timestamps: false,})

export default purchasePolicyElementSchema;
