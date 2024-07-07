const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.get('/products', async (req, res) => {
  try {
    const products = await req.db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: `Error fetching products: ${err.message}` });
  }
});

router.get('/products/random', async (req, res) => {
  try {
    const randomProduct = await req.db.collection('products').aggregate([{ $sample: { size: 1 } }]).toArray();
    res.json(randomProduct[0]);
  } catch (err) {
    res.status(500).json({ message: `Error fetching random product: ${err.message}` });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await req.db.collection('products').findOne({ _id: ObjectId(req.params.id) });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error fetching product: ${err.message}` });
  }
});

router.post('/products', async (req, res) => {
  const { name, client } = req.body;
  if (!name || !client) {
    return res.status(400).json({ message: 'Name and client are required' });
  }

  try {
    const result = await req.db.collection('products').insertOne({ name, client });
    res.status(201).json({ message: 'Product created', id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: `Error creating product: ${err.message}` });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, client } = req.body;
  if (!name || !client) {
    return res.status(400).json({ message: 'Name and client are required' });
  }

  try {
    const result = await req.db.collection('products').updateOne(
      { _id: ObjectId(req.params.id) },
      { $set: { name, client } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ message: 'Product updated' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error updating product: ${err.message}` });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const result = await req.db.collection('products').deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json({ message: 'Product deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: `Error deleting product: ${err.message}` });
  }
});

module.exports = router;
