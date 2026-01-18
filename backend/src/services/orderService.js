import { prisma as prismaClient } from '../config/db.js';
import { PrismaQueryBuilder } from '../utils/queryBulider.js';
import OrderStatus from '../constants/enums/orderStatus.js';

const orderService = {
    MAX_LIMIT: 100,
    DEFAULT_SELECTIONS: {
        id: true,
        userId: true,
        totalPrice: true,
        itemsCount: true,
        status: true,
        createdAt: true,
    },

    DEFAULT_EXCLUDE_FIELDS: {
        updatedAt: true,
    },

    DEFAULT_RELATIONS: {
        orderItems: true,
    },

    ALLOWED_RELATIONS: ['user', 'orderItems'],

    // CREATE ORDER
    async create(
        userId,
        totalPrice,
        itemsCount,
        status = OrderStatus.PENDING,
        { selections, relations, exclude, filters } = {},
        tx = prismaClient
    ) {
        const query = new PrismaQueryBuilder({
            allowedRelations: orderService.ALLOWED_RELATIONS,
            maxLimit: orderService.MAX_LIMIT,
        })
            .select(selections || orderService.DEFAULT_SELECTIONS)
            .include(relations || orderService.DEFAULT_RELATIONS)
            .omit(exclude || orderService.DEFAULT_EXCLUDE_FIELDS)
            .where(filters || {}).value;

        return tx.order.create({
            data: {
                userId,
                totalPrice,
                itemsCount,
                status,
            },
            ...query,
        });
    },

    // FIND ORDER BY ID
    async findById(id, { selections, relations, exclude, filters } = {}) {
        const query = new PrismaQueryBuilder({
            allowedRelations: orderService.ALLOWED_RELATIONS,
            maxLimit: orderService.MAX_LIMIT,
        })
            .select(selections || orderService.DEFAULT_SELECTIONS)
            .include(relations || orderService.DEFAULT_RELATIONS)
            .omit(exclude || orderService.DEFAULT_EXCLUDE_FIELDS)
            .where({ id, ...filters }).value;

        return prismaClient.order.findFirst(query);
    },

    // DELETE ORDER BY ID
    async delete(id, tx = prismaClient) {
        return tx.order.delete({
            where: { id },
        });
    },

    // GET USER ORDERS
    async getUserOrders(
        userId,
        { selections, relations, exclude, filters, pagination, sort } = {}
    ) {
        const query = new PrismaQueryBuilder({
            allowedRelations: orderService.ALLOWED_RELATIONS,
            maxLimit: orderService.MAX_LIMIT,
        })
            .select(selections || orderService.DEFAULT_SELECTIONS)
            .include(relations || orderService.DEFAULT_RELATIONS)
            .omit(exclude || orderService.DEFAULT_EXCLUDE_FIELDS)
            .where({ userId, ...filters })
            .paginate(pagination)
            .sort(sort).value;

        return prismaClient.order.findMany(query);
    },

    // UPDATE ORDER STATUS BY ORDER ID
    async updateOrderStatus(orderId, status, tx = prismaClient) {
        return tx.order.update({
            where: { id: orderId },
            data: { status },
        });
    },

    // RETURN ORDER STATUS
    async status(id, userId) {
        const relations = {};
        const selections = {
            status: true,
        };

        return await orderService.findById(id, {
            selections,
            relations,
            filters: { userId },
        });
    },

    // CREATE BULK ORDER ITEMS
    async createOrderItemsBulk(id, items, tx = prismaClient) {
        return tx.orderItem.createManyAndReturn({
            data: items.map((item) => ({
                orderId: id,
                ticketTypeId: item.ticketTypeId,
                price: parseFloat(item.price),
                quantity: parseInt(item.quantity),
            })),
        });
    },
};

export default orderService;
