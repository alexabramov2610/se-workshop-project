import { Schema } from "mongoose";

const itemSchema = new Schema({
  id: { type: Number },
  catalogNumber: { type: Number },
});

export default itemSchema;
