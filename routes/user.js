const router = require('express').Router();
const { verifyTokenAndAuthorization, verifyAdmin } = require('../filter/Jwtfilter');
const User = require('../models/User');

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    .then((user) => {
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, message: 'updated' });
    }).catch(err=> res.status(500).json({ok:false, message:err.message}))
 
});

router.get("/", verifyAdmin, async (req, res)=>{
    User.find().then((data)=>{
        res.status(200).json(data)
    })
})
module.exports = router;