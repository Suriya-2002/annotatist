const express = require('express');

const annotateRoutes = require('./routes/annotate');

const app = express();

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use('/annotate', annotateRoutes);

app.get('/', (req, res, next) => {
    res.render('index');
});

app.listen(2002, 'localhost');

module.exports = app;
