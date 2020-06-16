import mongoose from "mongoose";
import assignAgreementSchema from "../../schemas/assignAgreement.schema";

export default mongoose.model("assignAgreements", assignAgreementSchema);
