const crypto = require('crypto');

function md5Middleware(req, res, next) {
  const { value } = req.body;

  if (!value) {
    return res.status(400).send("Error: 'value' parameter is missing in the request");
  }

  const md5Hash = crypto.createHash('md5').update(value).digest('hex');

  res.send(md5Hash);
}

module.exports = md5Middleware;
