import mongoose from "mongoose";
import productSchema from "../../schemas/product.schema"


export default mongoose.model("products", productSchema);
