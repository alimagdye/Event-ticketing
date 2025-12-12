class PrismaQueryBuilder {
    constructor(config = {}) {
        this._pagination = null;
        this._sort = null;
        this._select = null;
        this._include = null;
        this._omit = null;
        this._where = {};
        this._maxLimit = config.maxLimit || 100;
        this._allowedRelations = config.allowedRelations || [];
    }

    paginate(page = 1, limit = 10) {
        const safePage = Math.max(1, parseInt(page) || 1);
        const safeLimit = Math.min(this._maxLimit, Math.max(1, parseInt(limit) || 10));
        this._pagination = { page: safePage, limit: safeLimit };
        return this;
    }

    sort(orderBy) {
        if (orderBy) this._sort = orderBy;
        return this;
    }

    select(fields) {
        if (fields && Object.keys(fields).length > 0) this._select = fields;
        return this;
    }

    include(relations) {
        if (relations && Object.keys(relations).length > 0) {
            if (this._allowedRelations.length > 0) {
                this._include = Object.keys(relations)
                    .filter((rel) => this._allowedRelations.includes(rel))
                    .reduce((acc, rel) => ({ ...acc, [rel]: relations[rel] }), {});
            } else {
                this._include = relations;
            }
        }
        return this;
    }

    omit(fields) {
        if (fields && Object.keys(fields).length > 0) this._omit = fields;
        return this;
    }

    where(filters) {
        if (filters) this._where = filters;
        return this;
    }

    get value() {
        const query = {};

        if (this._pagination) {
            query.skip = (this._pagination.page - 1) * this._pagination.limit;
            query.take = this._pagination.limit;
        }

        if (this._sort) {
            query.orderBy = this._sort;
        }

        if (Object.keys(this._where).length > 0) {
            query.where = this._where;
        }

        if (this._select) {
            query.select = { ...this._select };

            if (this._include && Object.keys(this._include).length > 0) {
                Object.keys(this._include).forEach((relation) => {
                    query.select[relation] = this._include[relation];
                });
            }
        } else {
            if (this._include && Object.keys(this._include).length > 0) {
                query.include = this._include;
            }
            if (this._omit) query.omit = this._omit;
        }

        return query;
    }
}

export { PrismaQueryBuilder };
