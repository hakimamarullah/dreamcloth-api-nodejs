const {
  verifyAdmin,
  verifyTokenAndAuthorization,
} = require('../filter/Jwtfilter');
const Product = require('../models/Product');
const router = require('express').Router();

router.post('/', verifyAdmin, async (req, res) => {
  const data = req.body;
  const newProduct = new Product(req.body);

  newProduct
    .save(newProduct)
    .then((product) => {
      const { _id, ...others } = product._doc;
      res.status(201).json({ id: _id, ...others });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message, ok: false });
    });
});

router.get('/', verifyTokenAndAuthorization, async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      if (!product) throw new Error('Product Not Found');
      res.status(200).json(product);
    })
    .catch((err) => res.status(404).json({ ok: false, message: err.message }));
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({
        ok: true,
        message: `Product with id: ${req.params.id} has been deleted`,
      })
    )
    .catch((err) =>
      res.status(404).json({
        ok: false,
        message: `Product with id: ${req.params.id} Not Found`,
      })
    );
});

router.put('/:id', verifyAdmin, async (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    {
      new: true,
    }
  )
    .then((productUpdated) => {
      if (!productUpdated) throw new Error('Product Not Found');
      res
        .status(200)
        .json({ ok: true, message: 'updated', product: productUpdated });
    })
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});

router.post('/batch', verifyAdmin, async (req, res) => {
  Product.insertMany(req.body)
    .then((products) => res.status(201).json(products))
    .catch((err) => res.status(500).json({ ok: false, message: err.message }));
});
module.exports = router;
