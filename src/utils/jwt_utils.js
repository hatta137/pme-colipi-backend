import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import User from "../models/user_model.js";
import {ResponseCodes} from "./response_utils.js";

const secret = 'KQ^$hP)g,a}e+?5JR>#CHxEpG&Dd=f_c';

export const useJWT = () => {
    return (request, response, next) => {
        expressjwt({ secret: secret, algorithms: ['HS256'] })(request, response, async (error) => {
            if (error) {
                console.error(error);
                response.internalError();
            }

            try {
                const user = await User.findById(request.auth.userId);
                if (user) {
                    next();
                } else {
                    response.forbidden(ResponseCodes.InvalidToken);
                }
            } catch (error2) {
                console.error(error2);
                response.internalError();
            }
        });
    };
};

export const createJWT = (payload) => {
    return jwt.sign(payload, secret, {});
};

