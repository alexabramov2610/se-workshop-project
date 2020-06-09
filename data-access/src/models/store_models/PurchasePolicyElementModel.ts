import mongoose from "mongoose";
import discountPolicySchema from "../../schemas/discountPolicy.schema";
import discountSchema from "../../schemas/discount.schema";
import purchasePolicyElementSchema from "../../schemas/purchasePolicyElement.schema";


export default mongoose.model("purchasePoliciesElements", purchasePolicyElementSchema);
