const express = require('express');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', (req, res, next) => {
    res.render('index');
});

app.listen(2002, 'localhost');

module.exports = app;
