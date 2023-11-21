import { response } from "express";

export const ResponseCodes = {
    Success: 'SUCCESS',
    BadInput: 'BAD_INPUT',
    Forbidden: 'FORBIDDEN',
    InternalServerError: 'INTERNAL_SERVER_ERROR',
    NotFound: 'NOT_FOUND',
    WGNotFound: 'WG_NOT_FOUND',
    AlreadyInWG: 'ALREADY_IN_WG',
    NotInWG: 'NOT_IN_WG',
    UserNotFound: 'USER_NOT_FOUND',
    UserAlreadyInWG: 'USER_ALREADY_IN_WG',
    OnlyCreatorCanDoThat: 'ONLY_CREATOR_CAN_DO_THAT',
    UserIsNotInYourWG: 'USER_IS_NOT_IN_YOUR_WG',
    WGIsFull: 'WG_IS_FULL',
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
function badInput(status = null, data = null) {
    const json = {
        status: !status ? ResponseCodes.BadInput : status
    };

    if (data) {
        json.data = data;
    }

    this.status(400).json(json);
}
response.badInput = badInput;

/**
 * @memberof Response
 * @instance
 */
function notFound(status = null, data = null) {
    const json = {
        status: !status ? ResponseCodes.NotFound : status
    };

    if (data) {
        json.data = data;
    }

    this.status(404).json(json);
}
response.notFound = notFound;

/**
 * @memberof Response
 * @instance
 */
function forbidden(status = null, data = null) {
    const json = {
        status: !status ? ResponseCodes.Forbidden : status
    };

    if (data) {
        json.data = data;
    }

    this.status(403).json(json);
}
response.forbidden = forbidden;

/**
 * @memberof Response
 * @instance
 */
function internalError(data = null) {
    const json = {
        status: ResponseCodes.InternalServerError
    };

    if (data) {
        json.data = data;
    }

    this.status(500).json(json);
}
response.internalError = internalError;
