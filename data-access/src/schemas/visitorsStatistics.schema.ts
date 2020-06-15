import { Schema } from "mongoose";

const visitorsStatisticsSchema = new Schema({
  date: { type: Date, required: true },
  guests: { type: Number, required: true },
  registeredUsers: { type: Number, required: true },
  managers: { type: Number, required: true },
  owners: { type: Number, required: true },
  admins: { type: Number, required: true },
}, {autoCreate: true});


export default visitorsStatisticsSchema;
