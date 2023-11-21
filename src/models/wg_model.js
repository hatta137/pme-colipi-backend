import mongoose from "mongoose";
import User from "./user_model.js";
const Schema = mongoose.Schema;

const shoppingItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    notes: String,
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true
    }
});

const wgSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    invitationCode: {
        type: String,
        required: true,
        unique: true
    },
    maximumMembers: {
        type: Number,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: true
    },
    members: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }],
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    shoppingList: [shoppingItemSchema]
});

wgSchema.statics.createWG = async function (user, name, invitationCode, maximumMembers, additionalUsernames = []) {
    let members = [ user._id ];
    for (const usernameToAdd of additionalUsernames) {
        const userToAdd = await User.findOne({ username: usernameToAdd });
        members.push(userToAdd._id);
    }

    const wg = await this.create({
        name: name,
        invitationCode: invitationCode,
        members: members,
        maximumMembers: maximumMembers,
        creator: user._id,
        shoppingList: []
    });
    await wg.save();

    for (const memberId of members) {
        const member = await User.findById(memberId);
        member.wg = wg._id;
        await member.save();
    }
};

wgSchema.methods.delete = async function () {
    for (const memberId of this.members) {
        const member = await User.findById(memberId);
        member.wg = null;
        await member.save();
    }

    await this.deleteOne({ _id: this._id });
};

wgSchema.methods.containsUser = function (user) {
    return user.wg._id.toString() === this._id.toString();
};

wgSchema.methods.getMemberCount = function (user) {
    return this.members.length;
};

wgSchema.methods.addUser = async function (user) {
    this.members.push(user._id);
    await this.save();

    user.wg = this._id;
    await user.save();
};

wgSchema.methods.removeUser = async function (user) {
    // TODO: If creator is removed, change creator field to random person?

    this.members = this.members.filter(memberId => memberId.toString() !== user._id.toString());
    await this.save();

    user.wg = null;
    await user.save();
};

wgSchema.methods.addShoppingListItem = async function (user, title, notes) {
    const shoppingItem = {
        title: title,
        notes: notes,
        creator: user._id
    };
    this.shoppingList.push(shoppingItem);

    await this.save();
};

wgSchema.methods.removeShoppingListItemByID = async function (id) {
    this.shoppingList = this.shoppingList.filter(item => item._id.toString() !== id.toString());
    await this.save();
};

export default mongoose.model("WG", wgSchema);