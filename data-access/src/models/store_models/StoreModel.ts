import mongoose from "mongoose";
import storeSchema from "../../schemas/store.schema";


export default mongoose.model("stores", storeSchema);
