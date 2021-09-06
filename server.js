// create express app

var express = require('express');
var app = express();

// set local port for quick testing

// app.set('port', 5125);

// set heroku port for deployment

var port = process.env.PORT || 8080;
app.set('port', port);

// set public files to be displayed

app.use(express.static(__dirname + "/public"));

// set home route

app.get("/", function(req, res) {
    res.render("index");
});

// set error routes

app.use(function(req,res){
    res.status(404);
    res.render('404');
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
  });

  // set listen port
  
  app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });

