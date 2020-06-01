import { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const storeSchema = new Schema({

});

storeSchema.plugin(uniqueValidator);

export default storeSchema;
