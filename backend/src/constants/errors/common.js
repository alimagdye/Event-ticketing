
const CommonErrors = Object.freeze({
    UNKNOWN_ERROR: 'An unknown error has occurred.',
    INVALID_REQUEST: 'The request is invalid.',
    NOT_FOUND: 'The requested resource was not found.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access to this resource is forbidden.',
    INTERNAL_SERVER_ERROR: 'Internal server error. Please try again later.',
    SERVICE_UNAVAILABLE: 'The service is currently unavailable. Please try again later.',
    TIMEOUT: 'The request has timed out. Please try again.',
    CONFLICT: 'A conflict occurred with the current state of the resource.',
    BAD_GATEWAY: 'Received an invalid response from the upstream server.',
    GATEWAY_TIMEOUT: 'The gateway has timed out while waiting for a response.',
    RATE_LIMIT_EXCEEDED: 'You have exceeded the allowed number of requests. Please slow down.',
    VALIDATION_ERROR: 'There was a validation error with the provided data.',
});


export default CommonErrors;