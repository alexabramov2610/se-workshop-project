import {Schema, Types} from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import {ManagementPermission} from "se-workshop-20-interfaces/dist/src/Enums";

const storeManagerSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        managerPermissions: {
            type: [String],
            required: true,
            default: [],
            enum: Object.values(ManagementPermission)
        },
    },
    {timestamps: false,});

storeManagerSchema.plugin(uniqueValidator);

export default storeManagerSchema;
