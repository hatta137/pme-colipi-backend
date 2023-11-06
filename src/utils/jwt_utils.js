import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';

const secret = 'KQ^$hP)g,a}e+?5JR>#CHxEpG&Dd=f_c';

export const useJWT = () => {
    return (request, response, next) => {
        expressjwt({ secret: secret, algorithms: ['HS256'] })(request, response, next);
    };
};

export const createJWT = (payload) => {
    return jwt.sign(payload, secret, {});
};

