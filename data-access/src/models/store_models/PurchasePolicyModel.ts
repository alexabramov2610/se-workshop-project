import mongoose from "mongoose";
import purchasePolicySchema from "../../schemas/purchasePolicy.schema";


export default mongoose.model("purchasePolicies", purchasePolicySchema);
