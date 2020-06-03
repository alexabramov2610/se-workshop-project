import mongoose from "mongoose";
import eventSchema from "../../schemas/event.schema"


export default mongoose.model("events", eventSchema);
