import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const productSchema = new Schema({

});

productSchema.plugin(uniqueValidator);

export default productSchema;
