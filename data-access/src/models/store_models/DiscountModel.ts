import mongoose from "mongoose";
import discountPolicySchema from "../../schemas/discountPolicy.schema";
import discountSchema from "../../schemas/discount.schema";


export default mongoose.model("discounts", discountSchema);
