import {Schema} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const assignAgreementSchema = new Schema({
    assignedByOwner: {type: String, required: true},
    newOwner: {type: String, required: true},
    requiredApprove: [{type: String}],
    approvedBy: [{type: String}],
    storeName: {type: String, required: true},
    pending: {type: Boolean, default: true}
});

assignAgreementSchema.plugin(uniqueValidator);

export default assignAgreementSchema;
