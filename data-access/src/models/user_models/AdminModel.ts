import mongoose from "mongoose";
import adminSchema from "../../schemas/admin.schema";


export default mongoose.model("admins", adminSchema);
