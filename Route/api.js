'use strict'
const { Router } = require('express')
const { ProductController } = require('../Controller/ProductsController')
const { CategoryController } = require('../Controller/CategoriesController')
const router = new Router()
/* PRODUCT */
router.post('/product', ProductController.addProduct)
router.get('/product', ProductController.showProduct)
router.get('/product/:id', ProductController.showOneProduct)
router.get('/product/delete/:id', ProductController.deleteProduct)
router.get('/product/all/:id', ProductController.getProdrelatedtoSubCat)
router.put('/product/update/:id', ProductController.updateProduct)

/* CATEGORY */
router.post('/category', CategoryController.addCategory)
router.get('/categories/export', CategoryController.showCategory)
router.get('/category/:id', CategoryController.showOneCategory)
router.get('/category/delete/:id', CategoryController.deleteCategory)
router.put('/category/update/:id', CategoryController.updateCategory)

module.exports = router