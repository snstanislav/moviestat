const path = require('path');
const express = require(
  path.join(process.env.NODE_PATH, 'express'));

const indexRouter = require('./routes/index.js');
const filmRouter = require('./routes/film.js');
const personRouter = require('./routes/person.js');
const evalRouter = require('./routes/eval.js');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
//


app.use(indexRouter)
app.use(filmRouter)
app.use(personRouter)
app.use(evalRouter)


app.listen(3006);