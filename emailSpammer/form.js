var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
 
// Running Server Details.
var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at port %d in %s mode", this.address().port, app.settings.env);
});
 
 
app.get('/', function (req, res) {

  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});
 
app.post('/thank', urlencodedParser, function (req, res){

  var transporter = nodemailer.createTransport({
    service: req.body.emailService.toLowerCase(),
    auth: {
      user: req.body.fromEmail,
      pass: req.body.password
    }
  });

  var mailOptions = {
    from: req.body.fromEmail,
    to: req.body.toEmail,
    subject: req.body.subject,
    text: req.body.message
  };

  for(var i=0; i<parseInt(req.body.numOfEmails); i++) {
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
  }

  var reply='';
  reply += "Sending " + req.body.numOfEmails + " email(s) to <strong>" + req.body.toEmail + "</strong> from <strong>" + req.body.fromEmail + "</strong>";
  res.send(reply);
 });