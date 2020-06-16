import mongoose from "mongoose";
import visitorsStatisticsSchema from "../../schemas/visitorsStatistics.schema";


export default mongoose.model("visitorsStatistics", visitorsStatisticsSchema);
