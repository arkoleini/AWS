const path = require('path');
const isauth = require('../middleware/is-auth');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', isauth,shopController.getIndex);

router.get('/products', isauth,shopController.getProducts);

router.get('/products/:productId',  isauth,shopController.getProduct);

router.get('/cart',  isauth,shopController.getCart);

router.post('/cart',  isauth,shopController.postCart);

router.post('/cart-delete-item',  isauth,shopController.postCartDeleteProduct);

router.post('/create-order',  isauth,shopController.postOrder);

router.get('/orders', isauth, shopController.getOrders);

module.exports = router;
