var Fiber = global.Fiber || require("fibers");
var mustache = require("mustache").render;
var xmldoc = require('xmldoc');
var markdown = require('marked');
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

function marked(md) {
  var html = markdown(md);
  return html.substring("<p>".length, html.length - "</p>".length - 1);
}

var NUMBERS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
var WRAPPERS = {
  root: function(element, content) {
    return content;
  },
  row: function(element, content) {
    return fill('<table class="block-grid {0}-up"><tr>{1}</tr></table>',
      [NUMBERS[element.childrenNamed("column").length - 1], content]);
  },
  column: function(element, content) {
    return fill('<td class="{1}">{0}</td>', [content, element.attr.panel ? "panel" : ""]);
  },
  button: function(element, content) {
    return fill('<table class="{0}-button {1} {2}"><tr><td>{3}</td></tr></table>',
      [
        element.attr.size || "small",
        element.attr.type,
        element.attr.border,
        content
      ]);
  }
};

function fill(string, args) {
  if(!string) return;
  for(var key in args) {
    string = string.replace(new RegExp('\\{' + key + '\\}','g'), args[key]);
  }
  return string;
}

function wrap(element, content) {
  return fill("<{0}>{1}</{0}>", [element.name, marked(content)]);
}

function print(element) {
  var r = [];
  element.children.forEach(function(child) {
    r.push(print(child));
  });
  var w =  WRAPPERS[element.name] || wrap;
  return w(element, r.join('') || marked(element.val));
}

var HEAD = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';

var html = exports.html = function(name, base, data) {
  data = data || {};
  var file = fs.resolve(base, name + '.md');
  var template = fs.resolve(module.filename, '../lib/base/index.html');
  var document = new xmldoc.XmlDocument('<root>' + mustache(fs.read(file), data) + '</root>');
  return HEAD + juiceSync(mustache(fs.read(template), {
      content: print(document)
    }), 'file://' + template, {});
};

var text = exports.text = function(name, base, data) {
  var file = fs.resolve(base, name + '.txt');
  return mustache(fs.read(file), data);
};

if (require.main === module) {

}