const { verifyTokenAndAuthorization, verifyToken, verifyAdmin } = require('../filter/Jwtfilter');
const Cart = require('../models/Cart')
const router = require('express').Router()

router.post('/', verifyToken, async (req, res) => {
    const data = req.body;
    const newCart = new Cart(req.body);
  
    newCart
      .save()
      .then((cart) => {
        const { _id, ...others } = cart._doc;
        res.status(201).json({ id: _id, ...others });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message, ok: false });
      });
  });

  router.put('/:id', verifyToken, async (req, res) => {
    Cart.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        {
            new: true,
        }
    )
        .then((cartUpdated) => {
            if (!cartUpdated) throw new Error('Cart Not Found');
            res
                .status(200)
                .json({ ok: true, message: 'updated', cart: cartUpdated });
        })
        .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

router.get('/:userId', verifyTokenAndAuthorization, async (req, res) => {
    Cart.findOne({ userId: req.params.userId })
        .then((cart) => {
            if (!cart) throw new Error('Cart Not Found');
            res.status(200).json(cart);
        })
        .catch((err) => res.status(404).json({ ok: false, message: err.message }));
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    Cart.deleteOne({ _id: req.params.id })
        .then(() =>
            res.status(200).json({
                ok: true,
                message: `Cart with id: ${req.params.id} has been deleted`,
            })
        )
        .catch((err) =>
            res.status(404).json({
                ok: false,
                message: `Cart with id: ${req.params.id} Not Found`,
            })
        );
});


router.get("/", verifyAdmin, async (req, res)=>{
    Cart.find()
    .then(carts=> res.status(200).json(carts))
    .catch(err=> res.status(500).json({ok: false, message: err.message}))
})

module.exports = router