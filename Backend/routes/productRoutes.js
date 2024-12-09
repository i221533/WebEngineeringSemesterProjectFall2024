const express = require('express');
const upload = require('../middlewares/multerconfig')
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();




router.post('/add',upload.single('image'), addProduct);
router.get('/', getAllProducts);


router.delete('/deleteProduct/:id', deleteProduct);
module.exports = router;
