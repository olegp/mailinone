var Fiber = global.Fiber || require("fibers");
var mustache = require("mustache").render;
var juice = require("juice");
var fs = require("fs-base");

function juiceSync(file, path, options, inline) {
  var result;
  var fiber = Fiber.current;
  options.url = path;
  options.preserveMediaQueries = true;
  juice.juiceContent(file, options, function(err, html) {
    if(Fiber.current == fiber) {
      result = html || err;
    } else {
      fiber.run(html || err);
    }
  });
  return result || Fiber.yield();
}

var HEAD = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';

var html = exports.html = function(name, base, data) {
  data = data || {};
  var file = fs.resolve(base, name + '.html');
  var template = fs.resolve(module.filename, '../lib/base/index.html');
  var content = fs.read(file);
  if(content) {
    return HEAD + juiceSync(mustache(fs.read(template), {
      content: mustache(content, data)
    }), 'file://' + template, {});
  }
};

var text = exports.text = function(name, base, data) {
  var file = fs.resolve(base, name + '.txt');
  var content = fs.read(file);
  if(content) {
    return mustache(content, data);
  }
};


