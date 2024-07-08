const Product = require('../models/products.model');
const mongoose = require('mongoose');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching products: ${err.message}` });
  }
};

exports.getRandomProduct = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    const rand = Math.floor(Math.random() * count);
    const product = await Product.findOne().skip(rand);
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching random product: ${err.message}` });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error fetching product: ${err.message}` });
  }
};

exports.createProduct = async (req, res) => {
  const { name, client } = req.body;
  if (!name || !client) {
    return res.status(400).json({ message: 'Name and client are required' });
  }

  try {
    const newProduct = new Product({ name, client });
    await newProduct.save();
    res.status(201).json({ message: 'Product created', id: newProduct._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error creating product: ${err.message}` });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, client } = req.body;
  if (!name || !client) {
    return res.status(400).json({ message: 'Name and client are required' });
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      product.name = name;
      product.client = client;
      await product.save();
      res.status(200).json({ message: 'Product updated' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error updating product: ${err.message}` });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Error deleting product: ${err.message}` });
  }
};
