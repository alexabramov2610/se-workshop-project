import mongoose from "mongoose";
import purchaseSchema from "../../schemas/purchase.schema"


export default mongoose.model("purchases", purchaseSchema);
