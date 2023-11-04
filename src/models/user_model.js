import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    wg: { type: mongoose.SchemaTypes.ObjectId, ref: "WG" },
    // ...
});

export default mongoose.model("User", userSchema);