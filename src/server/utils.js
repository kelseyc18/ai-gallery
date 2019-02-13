const keyczar = require('keyczarjs');
const base64 = require('base-64');
const fs = require('fs');
const protobuf = require('protobufjs');

// TODO: Currently, this only works if the authkey zip file has been
// unzipped.
const contents = fs.readFileSync(`${__dirname}/authkey/1`);
const contents2 = fs.readFileSync(`${__dirname}/authkey/meta`);
const keysetSerialized = JSON.stringify({
  1: JSON.stringify(JSON.parse(contents)),
  meta: JSON.stringify(JSON.parse(contents2)),
});
const keyset = keyczar.fromJson(keysetSerialized);

// Not working as expected right now...
exports.getUserInfoFromToken = token => new Promise((resolve, reject) => {
  const cookie = token.replace(/_/g, '/').replace(/-/g, '+');
  const decrypted = keyset.decryptBinary(base64.decode(cookie));
  protobuf.load(`${__dirname}/cookie.proto`, (err, root) => {
    if (err) reject(err);

    const CookieMessage = root.lookupType('cookieauth.cookie');
    const buffer = Buffer.from(decrypted, 'binary');
    const userInfo = CookieMessage.decode(buffer);
    resolve(userInfo);
  });
});
