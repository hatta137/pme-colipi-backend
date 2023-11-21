import User from "../models/user_model.js";
import {ResponseCodes} from "../utils/response_utils.js";
import {generateRandomString} from "../utils/random_utils.js";
import WG from "../models/wg_model.js";

const MAX_MEMBERS = 30;

async function viewWG(request, response) {
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

async function createWG(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (user.isInWG()) {
            response.forbidden(ResponseCodes.AlreadyInWG);
            return;
        }

        const { name, maximumMembers, users: additionalUsernames } = request.body;

        if (maximumMembers < 2 || maximumMembers > MAX_MEMBERS) {
            response.badInput();
            return;
        }

        if (additionalUsernames) {
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
            if (additionalUsernames.length + 1 > maximumMembers) {
                response.badInput();
                return;
            }
        }

        const invitationCode = generateRandomString(6);
        await WG.createWG(user, name, invitationCode, maximumMembers, additionalUsernames);

        response.success({ invitationCode: invitationCode });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function deleteWG(request, response) {
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

async function joinWG(request, response) {
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

        if (wg.getMemberCount() >= wg.maximumMembers) {
            response.forbidden(ResponseCodes.WGIsFull);
            return;
        }

        await wg.addUser(user);

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function leaveWG(request, response) {
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

async function kickFromWG(request, response) {
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

async function viewShoppingList(request, response) {
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

async function addShoppingListItem(request, response) {
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

async function removeShoppingListItem(request, response) {
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

export default {
    viewWG,
    createWG,
    deleteWG,
    joinWG,
    leaveWG,
    kickFromWG,
    viewShoppingList,
    addShoppingListItem,
    removeShoppingListItem
}