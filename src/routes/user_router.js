import {request, response, Router} from "express";
import { useJWT, createJWT } from "../utils/jwt_utils.js";
import User from "../models/user_model.js";
import { ResponseCodes } from "../utils/response_utils.js";
import bcrypt from 'bcryptjs'

const router = Router();

// register
router.post('/', async (request, response) => {
    try {
        const data = request.body;
        const saltRounds = 10;

        const newUser = new User({
            username: data["username"],
            email: data["email"],
            password: await bcrypt.hash(data["password"], saltRounds)
        });

        await newUser.save();

        response.status(200).json({ message: 'User erfolgreich angelegt', user: newUser });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
})


// login
router.post("/login", async (request, response)=>{
    try {
        const { username, password } = request.body;

        console.log(password);
        console.log(username);

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

        //const token = createJWT({ userId: user._id });
        //return response.cookie("token", token).json({success:true,message:'LoggedIn Successfully', userId: user._id, token: token})
        response.success(createJWT({ userId: user._id }));

    } catch (error) {
        console.error(error);
        response.internalError();
    }
})


// getAllUsers
router.get('/', useJWT(), async (request, response) => {
    try {
        const data = await User.find()
        response.status(200).json(data)
    } catch (error) {
        console.error(error);
        response.internalError();
    }
})

// deleteUser
router.delete("/:id", useJWT(), async (request, response)=>{
    try {

        //ToDo Benutzer us WG löschen?

        //ToDo den Benutzer löschen der gerade angemeldet ist, geht erst wenn Einiegung über Token da ist --> Cookie

        const deletedUser = await User.findByIdAndDelete(request.params.id);

        if (!deletedUser) {
            // Wenn der Benutzer nicht gefunden wurde, senden Sie eine 404-Fehlermeldung
            response.status(404).json({ error: 'Benutzer nicht gefunden' });
        } else {
            response.status(200).json({ message: 'Benutzer erfolgreich gelöscht' });
        }

    } catch (error) {
        console.error(error);
        response.internalError();
    }
})

export default router;