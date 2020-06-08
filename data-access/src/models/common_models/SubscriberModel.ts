import mongoose from "mongoose";
import subscriberSchema from "../../schemas/subscriber.schema";

export default mongoose.model("subscribers", subscriberSchema);
