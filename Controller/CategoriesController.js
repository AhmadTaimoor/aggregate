/* eslint-disable no-throw-literal */
/* eslint-disable no-console */
'use strict'
const { Category } = require('../Schema/categories')
const { Response } = require('../utils/response')
const { ErrorHandler } = require('../utils/errorhandler')
const mongoose = require('mongoose')
const json2csv = require('json2csv').parse
var pdf = require('../utils/pdf')
var ejs = require('../utils/ejs')
const { fs } = require('file-system')
var mongoXlsx = require('mongo-xlsx')

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
      let category = new Category({ name: name, ParentCategoryId: ParentCategoryId })
      await category.save()
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
  static async getpdf (req, res) {
    try {
      await Category.find((_err, data) =>
        ejs.toHTML('./Views/view_Category.ejs', { data: data }).then(function (html) {
          var options = { format: 'Letter' }
          var output = './pdf/Category_pdf_' + new Date().getTime() + '.pdf'
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
  //* *****************************************Getting CSV data&******************/
  static async getCsvdata (req, res) {
    try {
      await Category.find((_err, data) => {
        var fields = ['_id', 'name', 'ParentCategoryId']
        const opts = { fields }
        const csv = json2csv(data, opts)
        var resp = './pdf/Category_csv_' + new Date().getTime() + '.csv'
        fs.writeFile(resp, csv, () => {
          console.log('written successfully')
          console.log('FilePath :' + resp)
        })
      })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }
  //* *****************************************Get Xslx Data&******************/
  static async getXslxdata (req, res) {
    try {
      await Category.find((_err, data) => {
        var model = mongoXlsx.buildDynamicModel(data)
        var options = {
          save: true,
          sheetName: [],
          fileName: 'Category_xlsx_' + new Date().getTime() + '.xlsx',
          path: '../API/pdf',
          defaultSheetName: 'worksheet'
        }
        // eslint-disable-next-line handle-callback-err
        mongoXlsx.mongoData2Xlsx(data, model, options, function (err, data) {
          console.log('File saved at:', data.fullPath)
        })
      })
    } catch (error) {
      ErrorHandler.sendError(res, error)
    }
  }

  //* *****************************************Showing Specific Category&******************/
  static async showOneCategory (req, res) {
    try {
      let id = req.body.id

      let data = await Category.aggregate(
        [
          {
            $match:
          { _id: mongoose.Types.ObjectId(id) }
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
          },
          {
            $project: {
              '_id': 1, 'name': 1, 'parentCategory': { '_id': 1, 'name': 1 }
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
  //      * Delete Category from database
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
  //      * update Category into database
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
