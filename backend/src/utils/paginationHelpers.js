function parsePagination(query, maxLimit = 1000) {
    let limit = parseInt(query.limit, 10) || undefined;
    let page = parseInt(query.page, 10) || undefined;

    if (limit > maxLimit) {
        limit = maxLimit;
    }
    if (page < 1) {
        page = 1;
    }

    return { limit, page };
}

export { parsePagination };
