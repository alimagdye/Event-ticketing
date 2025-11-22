const jsend = {
    success(data = null) {
        return {
            status: 'success',
            data,
        };
    },

    fail(data = null) {
        return {
            status: 'fail',
            data,
        };
    },

    error(message = 'Internal Server Error', code = null, data = null) {
        const response = {
            status: 'error',
            message,
        };
        if (code) response.code = code;
        if (data) response.data = data;
        return response;
    },
};

export default Object.freeze(jsend);