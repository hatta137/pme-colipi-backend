import {Router} from "express";
import WG from "../models/wg_model.js";
import { useJWT, createJWT } from "../utils/jwt_utils.js";
import User from "../models/user_model.js";
import { ResponseCodes } from "../utils/response_utils.js";
import {generateRandomString} from "../utils/random_utils.js";

const router = Router();

router.get('/',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();

            response.success(wg);
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.post('/',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (user.isInWG()) {
                response.forbidden(ResponseCodes.AlreadyInWG);
                return;
            }

            const { name, users: additionalUsernames } = request.body;
            for (const usernameToAdd of additionalUsernames) {
                const userToAdd = await User.findOne({ username: usernameToAdd });
                if (!userToAdd) {
                    response.notFound(ResponseCodes.UserNotFound, { username: usernameToAdd });
                    return;
                }
                if (userToAdd.isInWG()) {
                    response.forbidden(ResponseCodes.UserAlreadyInWG, { username: usernameToAdd });
                    return;
                }
            }

            const invitationCode = generateRandomString(6);
            await WG.createWG(user, name, invitationCode, additionalUsernames);

            response.success({ invitationCode: invitationCode });
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.delete('/',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();
            if (!user.isCreatorOfWG(wg)) {
                response.forbidden(ResponseCodes.OnlyCreatorCanDoThat);
                return;
            }

            await wg.delete();

            response.success();
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.get('/join',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (user.isInWG()) {
                response.forbidden(ResponseCodes.AlreadyInWG);
                return;
            }

            const { code } = request.query;
            const wg = await WG.findOne({ invitationCode: code });
            if (!wg) {
                response.notFound(ResponseCodes.WGNotFound);
                return;
            }

            await wg.addUser(user);

            response.success();
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.get('/leave',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();
            await wg.removeUser(user);

            response.success();
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.get('/kick/:name',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);

            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();
            if (!user.isCreatorOfWG(wg)) {
                response.forbidden(ResponseCodes.OnlyCreatorCanDoThat);
                return;
            }

            const userToKick = await User.findOne({ username: request.params.name });
            if (!userToKick) {
                response.notFound(ResponseCodes.UserNotFound);
                return;
            }

            if (!wg.containsUser(userToKick)) {
                response.forbidden(ResponseCodes.UserIsNotInYourWG);
                return;
            }

            await wg.removeUser(userToKick);

            response.success();
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.get('/shoppinglist',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();

            response.success(wg.shoppingList);
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.post('/shoppinglist',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const { title, notes } = request.body;
            const wg = await user.getWG();

            await wg.addShoppingListItem(user, title, notes);

            response.success(wg.shoppingList);
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

router.delete('/shoppinglist/:id',
    useJWT(),
    async (request, response) => {
        try {
            const user = await User.findById(request.auth.userId);
            if (!user.isInWG()) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await user.getWG();
            await wg.removeShoppingListItemByID(request.params.id);

            response.success(wg.shoppingList);
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

export default router;