let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let index = require('./routes/index');
let test = require('./routes/test-post');
let helmet = require('helmet');
let app = express();




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/dist')));

app.use('/', index);
//app.use('/test', test);

app.post('/test', function (req, res) {
  console.log('REQ.BODY: ' + req.body);
    res.send('Hello Client');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(res.statusCode);
  next(res.error);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
