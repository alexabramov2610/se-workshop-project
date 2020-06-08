import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const systemSchema = new Schema({
    isSystemUp:  {type: Boolean},
});

systemSchema.plugin(uniqueValidator);

export default systemSchema;
