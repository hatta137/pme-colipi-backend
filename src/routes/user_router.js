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


// getUserById
router.get('/:id', useJWT(), async (request, response) => {
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
})

// deleteUser
router.delete("/", useJWT(), async (request, response)=>{
    try {
        //ToDo Benutzer us WG löschen?

        const userId = request.auth.userId;

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
})

// updateUser

router.put("/", useJWT(), async (request, response)=>{
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
})


// increase Beercounter
router.put("/increaseBeercounter/:value", useJWT(), async (request, response)=>{
    try {

        const userId = request.auth.userId;

        const value = parseInt(request.params.value, 10); // Hier verwenden wir parseInt

        console.log(value)
        // Benutzer abrufen
        const user = await User.findById(userId);

        if (!user) {
            return response.notFound();
        }

        // Den beercounter-Wert erhöhen
        user.beercounter += value;

        // Das aktualisierte Dokument speichern
        const updatedUser = await user.save();

        response.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        response.internalError();
    }
})

// decrease Beercounter
router.put("/decreaseBeercounter/:value", useJWT(), async (request, response)=>{
    try {

        const userId = request.auth.userId;

        const value = parseInt(request.params.value, 10); // Hier verwenden wir parseInt

        console.log(value)
        // Benutzer abrufen
        const user = await User.findById(userId);

        if (!user) {
            return response.notFound();
        }

        // Den beercounter-Wert erhöhen
        user.beercounter -= value;

        // Das aktualisierte Dokument speichern
        const updatedUser = await user.save();

        response.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        response.internalError();
    }
})
export default router;