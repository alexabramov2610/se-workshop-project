import mongoose from "mongoose";
import systemSchema from "../../schemas/system.schema";


export default mongoose.model("system", systemSchema);
