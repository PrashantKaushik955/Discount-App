const Product = require('../../../models/Product');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    if (!products) {
      return res.status(200).json([]); // Return an empty array if no products are found
    }
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
