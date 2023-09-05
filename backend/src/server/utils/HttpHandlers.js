class HttpHandler {
  static outOfRangeProperty(response, message) {
    response.status(400).json({ error: { message } });
    return;
  }
}
module.exports = HttpHandler;
