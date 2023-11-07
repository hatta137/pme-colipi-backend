import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import WG from "./wg_model.js"

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    beercounter: { type: Number, default: 0 },
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

userSchema.methods.isCreatorOfWG = function (wg) {
    return wg.creator.toString() === this._id.toString();
};

userSchema.methods.isInWG = function () {
    return this.wg !== null;
};

userSchema.methods.getWG = function () {
    return WG.findById(this.wg);
};

export default mongoose.model("User", userSchema);