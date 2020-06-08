import mongoose from "mongoose";
import itemSchema from "../../schemas/item.schema";

export default mongoose.model("items", itemSchema);
