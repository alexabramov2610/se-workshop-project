import mongoose from "mongoose";
import storeManagerSchema from "../../schemas/storeManager.schema";


export default mongoose.model("storeManagers", storeManagerSchema);
