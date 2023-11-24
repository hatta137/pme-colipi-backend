import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import WG from "./wg_model.js"

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
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

userSchema.methods.addBeerbonus = async function (beerbonus) {
    this.beercounter += beerbonus;
    await this.save();
    return this.beercounter;
}

userSchema.methods.reduceBeerbonus = async function (beerbonus) {
    this.beercounter -= beerbonus;
    await this.save();
    return this.beercounter;
}

export default mongoose.model("User", userSchema);