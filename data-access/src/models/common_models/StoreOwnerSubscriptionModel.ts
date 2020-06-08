import mongoose from "mongoose";
import storeOwnerSubscriptionSchema from "../../schemas/storeOwnerSubscription.schema";

export default mongoose.model("storeOwnerSubscriptions", storeOwnerSubscriptionSchema);