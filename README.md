# MailInOne

Uses the SendGrid API to send HTML and text emails, first populating templates with data provided.

## Usage

Install with `npm install mailinone`. Usage:

```
var mailinone = require('mailineone);

mailinone(name, base, data, {
		api_user: api_user,
	  api_key: api_key,
    from: from,
    fromname: fromname,
    to: to,
    subject: to,
    }, debug);
  ```

The arguments are:

* name - email template name
* base - base directory to load template from, two files are looked for in this directory {name}.txt and {name}.html for the text and html templates respectively; note that the html template should only contain the html body contents
* data - data used to populate the templates, Mustache is used for this
* api_user - SendGrid API username, if omitted, the SENDGRID_USER env variable is used
* api_jey - SendGrid API username, if omitted, the SENDGRID_USER env variable is used
* from - sender email
* fromname - sender name
* to - to email
* subject - email subject
* debug - if truthy, prints rendered text template to stdout instead of sending actual email out

