/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
'use strict'
const { Category } = require('../Schema/categories')
const { Response } = require('../utils/response')
const { ErrorHandler } = require('../utils/errorhandler')
const mongoose = require('mongoose')
var ejs = require('../utils/ejs')
var pdf = require('../utils/pdf')

class CategoryController {
  /**
     * API | POST
     * Adds a product to database
     * @example {
     *      name: String
     *      cat_des:String
     * @param {*} req
     *      req.body.name
     *      req.body.price
     *      req.body.quanitity
     * @param {*} res
     *      res.send
     *      res.status
     */
  static async addCategory (req, res) {
    try {
      let name = req.body.name
      let ParentCategoryId = req.body.ParentCategoryId
      if (name == null) { throw { code: 400, message: 'Name is required' } }
      // let ParentCategories=new Category({ParentCategoryId:ParentCategoryId})

      let category = new Category({ name: name, ParentCategoryId: ParentCategoryId })
      await category.save()
      // return new Response(res,{data:category,message:'Category saved successfully'});
      return new Response(res, { Category: category }, 'Category saved successfully')
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *************************************Showing Products***************************************/
  /**
//      * API | GET
//      * Export Category in pdf
//      * @example {
//         *      name: String
//         *      cat_des: String
//         * @param {*} req
//         * @param {*} res
//         *      res.send
//         *      res.status
//         */
  static async showCategory (req, res) {
    try {
      await Category.find((_err, data) =>
      // new Response(res, { data,message: 'Category retreived successfully' }))
      // res.render('../Views/view_Category.ejs',{data:data}))
        ejs.toHTML('./Views/view_Category.ejs', { data: data }).then(function (html) {
          var options = { format: 'Letter' }
          var output = './pdf/' + 'Category' + '.pdf'

          pdf.toPDF(html, options, output).then(function (response) {
            console.log('PDF file successfully written')
            console.log(response)
          }, function (error) {
            console.error(error)
          })
        })
      )
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *****************************************Showing Specific Category&******************/
  static async showOneCategory (req, res) {
    try {
      let id = req.body.id
      // eslint-disable-next-line no-unused-vars
      let err

      let data = await Category.aggregate(
        [
          {
            $match:
                    {
                      _id: mongoose.Types.ObjectId(id)
                    }
          },
          {
            $lookup:
                    {
                      from: 'categories',
                      localField: 'ParentCategoryId',
                      foreignField: '_id',
                      as: 'parentCategory'
                    }
          },
          {
            $addFields:
                    {
                      ParentCategoryId: null
                    }
          }
        ])
      return new Response(res, 'Category is shown', { Category: data })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  // //**************************************Deleting Product*****************************************/
  // /**
  //      * API | GET
  //      * Delete product from database
  //      * @example {s
  //         *      name: String
  //         *      cat_des: String
  //         * @param {*} req
  //         *      req.params.id
  //         * @param {*} res
  //         *      res.send
  //         *      res.status
  //         */
  static async deleteCategory (req, res) {
    try {
      await Category.findByIdAndDelete(req.params.id, () => {
        return new Response(res, { data: '', message: 'Category are deleted' })
      })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }

  // //****************************************Updating Category****************************************/
  // /**
  //      * API | PUT
  //      * update product into database
  //      * @example {
  //         *      name: String
  //         *      cat_des :String
  //         * @param {*} req
  //         *      req.params.id
  //         *       req.body.name
  //         *       req.body.cat_des
  //         * @param {*} res
  //         *      res.send
  //         *      res.status
  //         */

  static async updateCategory (req, res) {
    try {
      await Category.findByIdAndUpdate(req.params.id,
        { $set:
                    {
                      name: req.body.name,
                      cat_des: req.body.cat_des
                    } }, () => {
          return new Response(res, { data: '', message: 'Category are updated' })
        })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
//* *************************************************************************************************/
}

module.exports = { CategoryController }
