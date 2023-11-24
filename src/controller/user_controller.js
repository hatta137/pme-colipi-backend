import User from "../models/user_model.js";
import bcrypt from "bcryptjs";
import {createJWT} from "../utils/jwt_utils.js";
import {ResponseCodes} from "../utils/response_utils.js";

export async function register(request, response){
    try {
        const { username, email, password } = request.body;

        // Überprüfe, ob alle erforderlichen Felder vorhanden sind
        if (!username || !email || !password) {
            return response.badInput();
        }

        // Überprüfe, ob Benutzername oder E-Mail bereits in der Datenbank existieren
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return response.badInput(ResponseCodes.UsernameOrEmailTaken);
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            wg: null
        });

        await newUser.save();

        const token = createJWT({ userId: newUser._id });

        response.success({
            token: token
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function login(request, response){
    try {
        const { username, password } = request.body;

        const user = await User.findOne({ username });

        // Überprüfe ob User existiert
        if (!user) {
            console.log("Benutzer nicht gefunden");
            return response.forbidden(ResponseCodes.InvalidCredentials);
        }

        // Überprüfe das Passwort
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log("Passwort falsch");
            return response.forbidden(ResponseCodes.InvalidCredentials);
        }

        response.success({
            token: createJWT({userId: user._id})
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function getAllUsers(request, response){
    try {
        const user = await User.find()

        response.success({
            users: user
        })
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function getUserById(request, response){
    try {

        const userId = request.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return response.notFound()
        }

        response.success({
            user: user
        })
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function deleteUser(request, response){
    try {
        const userId = request.auth.userId;

        const user = await User.findById(userId);
        const wg = await user.getWG();
        await wg.removeUser(user);

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            // Wenn der Benutzer nicht gefunden wurde, senden Sie eine 404-Fehlermeldung
            return response.notFound();
        }

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function updateUser(request, response){
    try {

        const userId = request.auth.userId;
        const updateData = request.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return response.notFound();
        }

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}