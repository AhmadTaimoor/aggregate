/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
'use strict'
const { Product } = require('../Schema/products')
const { Response } = require('../utils/response')
const { ErrorHandler } = require('../utils/errorhandler')
const mongoose = require('mongoose')
class ProductController {
  /**
     * aPI | POST
     * Adds a product to database
     * @example {
     *      name: String
     *      price: Number
     *      quantity:Number
     * @param {*} req
     *      req.body.name
     *      req.body.price
     *      req.body.quanitity
     * @param {*} res
     *      res.send
     *      res.status
     */
  static async addProduct (req, res) {
    try {
      const name = req.body.name
      const price = req.body.price
      const quantity = req.body.quantity
      const CategoryId = req.body.CategoryId

      if (name == null || price == null) {
        throw { code: 400, message: 'Name/Price is required' }
      }
      const product = new Product({ name: name, price: price, quantity: quantity, CategoryId: CategoryId })

      await product.save()

      return new Response(res, { data: product,
        message: 'Category saved successfully' })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }

  //* *************************************showing Products***************************************/
  /**
 * aPI | GET
 * Retreive product from database
 * @example {
 *      name: String
 *      price: Number
 *      quantity:Number
 * @param {*} req
 *
 * @param {*} res
 *      res.send
 *      res.status
 */
  static async showProduct (_req, res) {
    try {
      await Product.find((_err, data) => new Response(res, { Product: data }, 'Category is shown'))
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *******************************************Getting one Product****************************/
  static async showOneProduct (req, res) {
    try {
      let id = req.body.id
      Product.aggregate(
        [
          {
            $match: { _id: mongoose.Types.ObjectId(id) }
          },
          {
            $lookup:
                          {
                            from: 'categories',
                            localField: 'CategoryId',
                            foreignField: '_id',
                            as: 'Category'
                          }
          },
          { $unwind: '$Category' },
          {
            $lookup:
                          {
                            from: 'categories',
                            localField: 'Category.ParentCategoryId',
                            foreignField: '_id',
                            as: 'ParentCategory'
                          }
          },
          { $unwind: '$ParentCategory' },
          {
            $project: {
              '_id': 1, 'name': 1, 'price': 1, 'quantity': 1, 'Category': { '_id': 1, 'name': 1 }, 'ParentCategory': { '_id': 1, 'name': 1 }
            }
          }
        ]).exec((err, data) => {
        console.log(id)
        if (err) throw err
        return new Response(res, 'Product is shown', { Product: data })
      })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *************************************deleting Product*****************************************/
  /**
 * aPI | GET
 * Delete product from database
 * @example {
 *      name: String
 *      price: Number
 *      quantity:Number
 * @param {*} req
 *      req.params.id
 * @param {*} res
 *      res.send
 *      res.status
 */
  static async deleteProduct (req, res) {
    try {
      await Product.findByIdAndDelete(req.params.id, () => new Response(res, { data: '',
        message: 'Category Deleted successfully' }))
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }

  //* ***************************************updating Product****************************************/
  /**
 * aPI | PUT
 * update product into database
 * @example {
 *      name: String
 *      price: Number
 *      quantity:Number
 * @param {*} req
 *      req.params.id
 *       req.body.name
 *       req.body.price
 *       req.body.quantity
 * @param {*} res
 *      res.send
 *      res.status
 */

  static async updateProduct (req, res) {
    try {
      await Product.findByIdAndUpdate(
        req.params.id,
        { $set:
                    {
                      name: req.body.name,
                      price: req.body.price,
                      quantity: req.body.quantity
                    } }, () => new Response(res, { data: '',
          message: 'Category updated successfully' })
      )
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *************************************************************************************************/

  static async getProdrelatedtoSubCat (req, res) {
    try {
      await Product.find({ Category: req.params.id }, (_err, Category) => new Response(res, { data: Category,
        message: 'Product related to a specific subcatgeory is retreived' }))
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
}

module.exports = { ProductController }
