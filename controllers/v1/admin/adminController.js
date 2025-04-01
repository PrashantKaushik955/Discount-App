const Product = require('../../../models/Product');
const User = require('../../../models/User');

// Add a Product
exports.addProduct = async (req, res) => {
  try {
    const { name, price, cashbackPercentage, category } = req.body;

    const newProduct = new Product({
      name,
      price,
      cashbackPercentage,
      category,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully.', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email wallet');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
