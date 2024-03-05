const path = require('path');
const express = require(
  path.join(process.env.NODE_PATH, 'express'));

const indexRouter = require('./routes/index.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(indexRouter)

app.listen(3000);








// view engine setup
//app.set('views', path.join(__dirname, 'views'));


//app.use(express.json());
/*app.use(express.urlencoded({extended: false}));*/
//