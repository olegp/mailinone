var send = require('./send');
var render = require('./render');

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

module.exports = function(name, base, data, opts, debug) {
  if(debug) {
    console.log(render.text(name, base, data));
  } else {
    return send(merge(opts, {
			api_user: process.env.SENDGRID_USER,
			api_key: process.env.SENDGRID_KEY,
      text: render.text(name, base, data),
      html: render.html(name, base, data)
    }));
  }
};

