import User from "../models/user_model.js";
import {ResponseCodes} from "../utils/response_utils.js";
import {generateRandomString} from "../utils/random_utils.js";
import WG from "../models/wg_model.js";
import Task from "../models/task_model.js";

const MAX_MEMBERS = 30;

async function viewWG(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        /* Big query to forge the final json with exclusively data that is necessary to the client */
        const wg = await user.getWG()
            .populate({
                path: 'members',
                select: 'username beercounter'
            })
            .populate({
                path: 'creator',
                select: 'username'
            })
            .populate({
                path: 'shoppingList.creator',
                select: 'username'
            })
            .select('-_id -__v');

        const wgId = (await user.getWG())._id;

        const tasks = await Task.find({ wg: wgId })
            .select('title description beerbonus');

        const result = {
            ...wg.toJSON(),
            tasks: tasks
        };

        response.success({
            wg: result
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function createWG(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (user.isInWG()) {
            return response.forbidden(ResponseCodes.AlreadyInWG);
        }

        let { name, maximumMembers, users: additionalUsernames } = request.body;

        if (maximumMembers < 2 || maximumMembers > MAX_MEMBERS) {
            return response.badInput();
        }

        if (additionalUsernames) {
            if (additionalUsernames.includes(user.username)) {
                /* To prevent a duplicate of the creator in the members array */
                additionalUsernames = additionalUsernames.filter(name => name !== user.username);
            }
            for (const usernameToAdd of additionalUsernames) {
                const userToAdd = await User.findOne({ username: usernameToAdd });
                if (!userToAdd) {
                    return response.notFound(ResponseCodes.UserNotFound, { username: usernameToAdd });
                }
                if (userToAdd.isInWG()) {
                    return response.forbidden(ResponseCodes.UserAlreadyInWG, { username: usernameToAdd });
                }
            }
            if (additionalUsernames.length + 1 > maximumMembers) {
                return response.badInput();
            }
        }

        const invitationCode = generateRandomString(6);
        await WG.createWG(user, name, invitationCode, maximumMembers, additionalUsernames);

        response.success({
            invitationCode: invitationCode
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function renameWG(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const wg = await user.getWG();
        if (!user.isCreatorOfWG(wg)) {
            return response.forbidden(ResponseCodes.OnlyCreatorCanDoThat);
        }

        const { name } = request.body;
        await wg.renameWG(name);

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function deleteWG(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const wg = await user.getWG();
        if (!user.isCreatorOfWG(wg)) {
            return response.forbidden(ResponseCodes.OnlyCreatorCanDoThat);
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
            return response.forbidden(ResponseCodes.AlreadyInWG);
        }

        const { code } = request.query;
        const wg = await WG.findOne({ invitationCode: code });
        if (!wg) {
            return response.notFound(ResponseCodes.WGNotFound);
        }

        if (wg.getMemberCount() >= wg.maximumMembers) {
            return response.forbidden(ResponseCodes.WGIsFull);
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
            return response.forbidden(ResponseCodes.NotInWG);
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
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const wg = await user.getWG();
        if (!user.isCreatorOfWG(wg)) {
            return response.forbidden(ResponseCodes.OnlyCreatorCanDoThat);
        }

        const userToKick = await User.findOne({ username: request.params.name });
        if (!userToKick) {
            return response.notFound(ResponseCodes.UserNotFound);
        }

        if (!wg.containsUser(userToKick)) {
            return response.forbidden(ResponseCodes.UserIsNotInYourWG);
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
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const wg = await user.getWG();

        response.success({
            shoppingList: wg.shoppingList
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function addShoppingListItem(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const { title, notes } = request.body;
        const wg = await user.getWG();

        await wg.addShoppingListItem(user, title, notes);

        response.success({
            shoppingList: wg.shoppingList
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function checkShoppingListItem(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const { isChecked } = request.body;
        const wg = await user.getWG();

        await wg.checkShoppingListItem(request.params.id, isChecked);

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function updateShoppingListItem(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const { title, notes } = request.body;
        const wg = await user.getWG();

        await wg.updateShoppingListItem(request.params.id, title, notes);

        response.success();
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

async function removeShoppingListItem(request, response) {
    try {
        const user = await User.findById(request.auth.userId);
        if (!user.isInWG()) {
            return response.forbidden(ResponseCodes.NotInWG);
        }

        const wg = await user.getWG();
        await wg.removeShoppingListItemByID(request.params.id);

        response.success({
            shoppingList: wg.shoppingList
        });
    } catch (error) {
        console.error(error);
        response.internalError();
    }
}

export default {
    viewWG,
    createWG,
    renameWG,
    deleteWG,
    joinWG,
    leaveWG,
    kickFromWG,
    viewShoppingList,
    addShoppingListItem,
    checkShoppingListItem,
    updateShoppingListItem,
    removeShoppingListItem
}