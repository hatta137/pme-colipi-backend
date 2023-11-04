import mongoose from "mongoose";
const Schema = mongoose.Schema;

const shoppingItemSchema = new Schema({
    title: String,
    notes: String,
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" }
});

const wgSchema = new Schema({
    name: String,
    invitationCode: String,
    members: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    shoppingList: [shoppingItemSchema]
});

export default mongoose.model("WG", wgSchema);