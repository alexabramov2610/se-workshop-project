import mongoose from "mongoose";
import storeOwnerSchema from "../../schemas/storeOwner.schema"


export default mongoose.model("storeOwners", storeOwnerSchema);
