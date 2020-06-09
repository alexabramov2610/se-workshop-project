import { Schema } from "mongoose";

const itemSchema = new Schema({
  id: { type: Number, required: true },
  catalogNumber: { type: Number, required: true },
});

export default itemSchema;
