import mongoose from "mongoose";
import notificationSchema from "../../schemas/notification.schema";


export default mongoose.model("notifications", notificationSchema);
