import mongoose from "mongoose";

class Connection {
    constructor() {
        const url =
            process.env.MONGODB_URI || `mongodb://localhost:27017/trading-system-db`;
        mongoose.Promise = global.Promise;
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useUnifiedTopology", true);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
        mongoose
            .connect(url, {serverSelectionTimeoutMS: 1500})
            .then(ref => console.log("Establish new connection with url", url))
            .catch(err => console.log("Could not connect to mongo server!", url, err));
    }
}

export default new Connection();
