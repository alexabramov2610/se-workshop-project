import mongoose from "mongoose";
import discountPolicySchema from "../../schemas/discountPolicy.schema";


export default mongoose.model("discountPolicies", discountPolicySchema);
