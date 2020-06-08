import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const purchasePolicySchema = new Schema({

});

purchasePolicySchema.plugin(uniqueValidator);

export default purchasePolicySchema;
