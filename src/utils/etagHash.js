const crypto = require('crypto');

const etagCreater = (data) => {
  // Create an MD5 hash of the data
  return crypto.createHash('md5').update(data).digest('hex');
};

module.exports = { etagCreater };