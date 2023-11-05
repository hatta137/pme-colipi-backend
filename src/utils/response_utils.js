import { response } from "express";

export const ResponseCodes = {
    Success: 'SUCCESS',
    BadInput: 'BAD_INPUT',
    Forbidden: 'FORBIDDEN',
    InternalServerError: 'INTERNAL_SERVER_ERROR',
    NotFound: 'NOT_FOUND',
    WGNotFound: 'WG_NOT_FOUND',
    AlreadyJoined: 'ALREADY_JOINED',
    NotInWG: 'NOT_IN_WG',
};

/**
 * @memberof Response
 * @instance
 */
function success(data = null) {
    const json = {
        status: ResponseCodes.Success
    };

    if (data) {
        json.data = data;
    }

    this.status(200).json(json);
}
response.success = success;

/**
 * @memberof Response
 * @instance
 */
function badInput(status = null) {
    this.status(400).json({
        status: !status ? ResponseCodes.BadInput : status
    });
}
response.badInput = badInput;

/**
 * @memberof Response
 * @instance
 */
function notFound(status) {
    this.status(404).json({
        status: !status ? ResponseCodes.NotFound : status
    });
}
response.notFound = notFound;

/**
 * @memberof Response
 * @instance
 */
function forbidden(status) {
    this.status(403).json({
        status: !status ? ResponseCodes.Forbidden : status
    });
}
response.forbidden = forbidden;

/**
 * @memberof Response
 * @instance
 */
function internalError(data) {
    const json = {
        status: ResponseCodes.InternalServerError
    };

    if (data) {
        json.data = data;
    }

    this.status(500).json(json);
}
response.internalError = internalError;
