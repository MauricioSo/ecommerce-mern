const router = require('express').Router();
const Product = require('../models/productModel');

router.get('/', async (req, res) => {

  try {
    const products = await Product.find();
    res.send(products)
  } catch (err) {
    res.status(400).send(err);
  }


})



router.get('/:id', async (req, res) => {

  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.send(product);
  } catch (err) {
    res.status(404).send({ message: 'Product Not Found.' });
  }



});


router.post('/:id/reviews', isAuth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      message: 'Review saved successfully.',
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});