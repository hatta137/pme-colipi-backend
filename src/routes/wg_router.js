import { Router } from "express";
import WG from "../models/wg_model.js";
import { useJWT, createJWT } from "../utils/jwt_utils.js";
import User from "../models/user_model.js";
import { ResponseCodes } from "../utils/response_utils.js";

const router = Router();

router.post('/test-auth', async (request, response) => {
    const testUser = await User.findOne({ username: "test" });
    response.success(createJWT({ userId: testUser._id }));
});

router.get('/',
    useJWT(),
    async (request, response) => {
        try {
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (!wgId) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await WG.findById(wgId);

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
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (wgId) {
                response.forbidden(ResponseCodes.AlreadyJoined);
                return;
            }

            const { name } = request.body;
            const invitationCode = generateRandomString(6);

            const wg = await WG.create({
                name: name,
                invitationCode: invitationCode,
                members: [ userId ],
                creator: userId,
                shoppingList: []
            });
            await wg.save();

            user.wg = wg._id;
            await user.save();

            response.success({
                invitationCode: invitationCode
            });
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
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (wgId) {
                response.forbidden(ResponseCodes.AlreadyJoined);
                return;
            }

            const { code } = request.query;
            const wg = await WG.findOne({ invitationCode: code });
            if (!wg) {
                response.notFound(ResponseCodes.WGNotFound);
                return;
            }

            wg.members.push(userId);
            await wg.save();

            user.wg = wg._id;
            await user.save();

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
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (!wgId) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            // TODO: If creator leaves, change creator field to random person?

            const wg = await WG.findById(wgId);
            wg.members = wg.members.filter(memberId => memberId.toString() !== userId);
            await wg.save();

            user.wg = null;
            await user.save();

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
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (!wgId) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await WG.findById(wgId);

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
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (!wgId) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const { title, notes } = request.body;
            const wg = await WG.findById(wgId);
            const shoppingItem = {
                title: title,
                notes: notes,
                creator: userId
            };
            wg.shoppingList.push(shoppingItem);

            await wg.save();

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
            const id = request.params.id;
            const userId = request.auth.userId;
            const user = await User.findById(userId);
            const wgId = user.wg;
            if (!wgId) {
                response.forbidden(ResponseCodes.NotInWG);
                return;
            }

            const wg = await WG.findById(wgId);
            wg.shoppingList = wg.shoppingList.filter(item => item._id.toString() !== id);

            await wg.save();

            response.success(wg.shoppingList);
        } catch (error) {
            console.error(error);
            response.internalError();
        }
    }
);

const generateRandomString = (length) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export default router;