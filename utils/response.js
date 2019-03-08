class Response {
  constructor (res, message, data, success = true, responseCode = 200) {
    this.success = success
    this.data = data
    this.message = message
    this.responseCode = responseCode
    this.res = res
    this.send()
  }
  /**
     * Send resposne
     */
  send () {
    this.res.status(this.responseCode).send(
      {
        success: this.success,
        status: this.responseCode,
        message: this.message,
        data: this.data
      }
    )
  }
}
module.exports = { Response }
