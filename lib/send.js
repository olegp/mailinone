var HttpClient = require("httpclient").HttpClient;

function merge() {
  var result = {};
  for (var i = arguments.length; i > 0; --i) {
    var obj = arguments[i - 1];
    for (var property in obj) {
      result[property] = obj[property];
    }
  }
  return result;
}

function urlEncode(object) {
  var buf = [];
  var key, value;
  for (key in object) {
    value = object[key];
    if (value instanceof Array) {
      for (var i = 0; i < value.length; i++) {
        if (buf.length)
          buf.push("&");
        buf.push(encodeURIComponent(key), "=", encodeURIComponent(value[i]));
      }
    } else {
      if (buf.length)
        buf.push("&");
      buf.push(encodeURIComponent(key), "=", encodeURIComponent(value));
    }
  }
  return buf.join('');
}

function request(url, params) {
  return new HttpClient(merge(params, {
    url:url,
    timeout:5000,
    agent:false,
    rejectUnauthorized:false
  })).finish();
};

var send = module.exports = function(args) {
  var e = request("https://api.sendgrid.com/api/mail.send.json", {
    method: "POST",
    headers:{
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    },
    body: [urlEncode(args)]
  });
  var content = e.body.read().decodeToString();
  var r = JSON.parse(content);
  if (r.message === 'error') {
    throw new Error(r.errors.join('\n'));
  }
};
