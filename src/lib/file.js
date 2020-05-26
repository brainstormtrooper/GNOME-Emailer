const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const crypto = imports.lib.aes;
// const crypto = imports.lib.crypto_js['crypto-js'];
const settings = imports.lib.settings;

var Import = function (path) {
  return new Promise((resolve, reject) => {
    let file = Gio.File.new_for_path(path);
    log('reading file from ' + path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {

      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];

        const dataString = contents.toString();
        // print(dataString);
        resolve(dataString);

      } catch (e) {
        log('Error loading data file : ' + e);
        reject(e);
      }
    });
  });
}

var save = function (path, data) {
  let dataStr = JSON.stringify(data, null, '\t');
  GLib.file_set_contents(path, dataStr);
}

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// https://stackoverflow.com/questions/21291279/how-to-convert-to-string-and-back-again-with-cryptojs
// replace with : https://github.com/brix/crypto-js ?
var rollUp = function () {
  const HASH = settings.getHash().toString();
  const roll = {
    FROM: app.Data.FROM,
    USER: app.Data.USER,
    PASS: crypto.CryptoJS.AES.encrypt(app.Data.PASS, HASH).toString(),
    HOST: app.Data.HOST,
    SUBJECT: app.Data.SUBJECT,
    HTML: app.Data.HTML,
    TEXT: app.Data.TEXT,
    TO: app.Data.TO,
    CSVA: app.Data.CSVA,
    VARS: app.Data.VARS,
  };
  return roll;
}

var unRoll = function (data) {
  const HASH = settings.getHash().toString();
  try {
    app.Data.FROM = data.FROM;
    app.Data.USER = data.USER;
    app.Data.PASS = (data.PASS ? crypto.CryptoJS.AES.decrypt(data.PASS, HASH).toString(crypto.CryptoJS.enc.Utf8) : '');
    // app.Data.PASS = (data.PASS ? crypto.AES.decrypt(data.PASS, HASH).toString(crypto.enc.Utf8) : '');
    app.Data.HOST = data.HOST;
    app.Data.SUBJECT = data.SUBJECT;
    app.Data.HTML = data.HTML;
    app.Data.TEXT = data.TEXT;
    app.Data.TO = data.TO;
    app.Data.CSVA = data.CSVA;
    app.Data.VARS = data.VARS;
  } catch (e) {
    log(e);
  }
}

var open = function (path) {
  let [ok, contents] = GLib.file_get_contents(path);
  if (ok) {
    let map = JSON.parse(contents);
    return map;
  } else {
    return {};
  }
}
