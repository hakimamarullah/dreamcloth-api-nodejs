const router = require('express').Router();
const {
    verifyAdmin,
    verifyToken,
    verifyTokenAndAuthorization,
} = require('../filter/Jwtfilter');
const Order = require('../models/Order');

router.post('/', verifyToken, async (req, res) => {
    const data = req.body;
    const newOrder = new Order(req.body);

    newOrder
        .save()
        .then((order) => {
            const { _id, ...others } = order._doc;
            res.status(201).json({ id: _id, ...others });
        })
        .catch((err) => {
            res.status(500).json({ message: err.message, ok: false });
        });
});

router.put('/:id', verifyAdmin, async (req, res) => {
    Order.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        {
            new: true,
        }
    )
        .then((orderUpdated) => {
            if (!orderUpdated) throw new Error('Order Not Found');
            res
                .status(200)
                .json({ ok: true, message: 'updated', order: orderUpdated });
        })
        .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    Order.deleteOne({ _id: req.params.id })
        .then(() =>
            res.status(200).json({
                ok: true,
                message: `Order with id: ${req.params.id} has been deleted`,
            })
        )
        .catch((err) =>
            res.status(404).json({
                ok: false,
                message: `Order with id: ${req.params.id} Not Found`,
            })
        );
});

router.get('/', verifyAdmin, async (req, res) => {
    Order.find()
        .then((orders) => res.status(200).json(orders))
        .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

//GET MONTHLY INCOME
router.get('/income', verifyAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                    sales: '$amount',
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: '$sales' },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', verifyTokenAndAuthorization, async (req, res) => {
    Order.find({ userId: req.params.userId })
        .then((orders) => {
            if (!orders) throw new Error('Order Not Found');
            res.status(200).json(orders);
        })
        .catch((err) => res.status(404).json({ ok: false, message: err.message }));
});

module.exports = router;
