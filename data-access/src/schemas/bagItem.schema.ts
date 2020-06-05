import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const bagItemSchema = new Schema({
    product: {type: Schema.Types.ObjectId, ref: 'products', required: true},
    amount: {type: Number, required: true},
    finalPrice: {type: Number}
});

bagItemSchema.plugin(uniqueValidator);

export default bagItemSchema;
