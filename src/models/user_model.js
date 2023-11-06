import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    beercounter: Number,
    wg: { type: mongoose.SchemaTypes.ObjectId, ref: "WG" },

});

userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password)
        return !!isMatch
    } catch (error) {
        throw new Error(error)
    }
};
export default mongoose.model("User", userSchema);