import mongoose from "mongoose";
import discountPolicySchema from "../../schemas/discountPolicy.schema";
import discountSchema from "../../schemas/discount.schema";
import conditionSchema from "../../schemas/condition.schema";


export default mongoose.model("conditions", conditionSchema);
