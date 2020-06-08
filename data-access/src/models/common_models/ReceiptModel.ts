import mongoose from "mongoose";
import receiptSchema from "../../schemas/receipt.schema"


export default mongoose.model("receipts", receiptSchema);
