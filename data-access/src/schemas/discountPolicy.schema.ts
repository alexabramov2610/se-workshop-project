import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const discountPolicySchema = new Schema({

});

discountPolicySchema.plugin(uniqueValidator);

export default discountPolicySchema;
