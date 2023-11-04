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

export const responseSuccess = (response, data) => {
    const json = {
        status: ResponseCodes.Success
    };

    if (data) {
        json.data = data;
    }

    response.status(200).json(json);
};

export const responseBadInput = (response, status) => {
    response.status(400).json({
        status: status === null ? ResponseCodes.BadInput : status
    });
};

export const responseNotFound = (response, status) => {
    response.status(404).json({
        status: status === null ? ResponseCodes.NotFound : status
    });
};

export const responseForbidden = (response, status) => {
    response.status(403).json({
        status: status === null ? ResponseCodes.Forbidden : status
    });
};

export const responseInternalError = (response, data) => {
    const json = {
        status: ResponseCodes.InternalServerError
    };

    if (data) {
        json.data = data;
    }

    response.status(500).json(json);
};