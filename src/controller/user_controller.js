import User from "../models/user_model.js";
import {ResponseCodes} from "../utils/response_utils.js";
import {generateRandomString} from "../utils/random_utils.js";
import bcrypt from "bcryptjs";
import {createJWT} from "../utils/jwt_utils.js";
import wg_controller from "./wg_controller.js";

// TODO mit in controller?
/*async function comparePassword(password){
    try {
        const isMatch = await bcrypt.compare(password, this.password)
        return !!isMatch
    } catch (error) {
        throw new Error(error)
    }
}*/

export async function register(request, response){
    try {
        const { username, email, password } = request.body;

        // Überprüfe, ob alle erforderlichen Felder vorhanden sind
        if (!username || !email || !password) {
            return response.status(400).json({ message: 'Ungültige Anfrage: Benutzername, E-Mail und Passwort sind erforderlich.' });
        }

        // Überprüfe, ob Benutzername oder E-Mail bereits in der Datenbank existieren
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            return response.status(400).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
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

        response.status(200).json({ message: 'User erfolgreich angelegt und angemeldet', user: newUser, token });
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

            return response.status(401).json({ error: 'Benutzer nicht gefunden' });
        }

        // Überprüfe das Passwort
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log("Passwort falsch");

            return response.status(401).json({ error: 'Ungültige Benutzerdaten' });
        }

        response.success(createJWT({ userId: user._id }));
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function getALlUsers(request, response){
    try {
        const user = await User.find()

        response.status(200).json(user)

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
            response.notFound()
        }
        response.status(200).json(user)
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export async function deleteUser(request, response){
    try {
        const userId = request.auth.userId;
        //TODO check

        const user = await User.findById(userId);
        const wg = await user.getWG();
        await wg.removeUser(user);

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            // Wenn der Benutzer nicht gefunden wurde, senden Sie eine 404-Fehlermeldung
            response.notFound();
        } else {
            response.success();
        }

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

        if (updatedUser) {
            response.success();
        } else {
            response.notFound();
        }

    } catch (error) {
        console.error(error);
        response.internalError();
    }
}