import mongoose from "mongoose";
import bagItemSchema from "../../schemas/bagItem.schema"


export default mongoose.model("bagItems", bagItemSchema);
