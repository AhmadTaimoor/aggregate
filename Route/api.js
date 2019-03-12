'use strict'
const { Router } = require('express')
const { ProductController } = require('../Controller/ProductsController')
const { CategoryController } = require('../Controller/CategoriesController')
const router = new Router()
/* PRODUCT */
router.post('/products', ProductController.addProduct)
// router.get('/products', ProductController.showProduct)
router.get('/products', ProductController.showOneProduct)
router.get('/products/delete/:id', ProductController.deleteProduct)
router.get('/products/all/:id', ProductController.getProdrelatedtoSubCat)
router.put('/products/update/:id', ProductController.updateProduct)

/* CATEGORY */
router.post('/categories', CategoryController.addCategory)
router.get('/categories', CategoryController.showOneCategory)
router.get('/categories/delete/:id', CategoryController.deleteCategory)
router.put('/categories/update/:id', CategoryController.updateCategory)
router.get('/categories/export', CategoryController.getpdf)
router.get('/categories/export/export-csv', CategoryController.getCsvdata)
router.get('/categories/export/export-xslx', CategoryController.getXslxdata)

module.exports = router
