const express = require('express');
const app = express();
const articleRouter = require('./routes/articles');
const Article = require('././models/article')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
//mongoose.set('strictQuery', false);// suggested by deprication warning

mongoose.connect('mongodb://localhost/blog')

app.use(express.urlencoded({extended : false}))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    // test data
    //const articles = [{
    //    title : 'test article1',
    //    createdAt : new Date(),
    //    description : 'Test Desc1'
    //},{
    //    title : 'test article2',
    //    createdAt : new Date(),
    //    description : 'Test Desc2'
    //},{
    //    title : 'test article3',
    //    createdAt : new Date(),
    //    description : 'Test Desc3'
    //}]

    //actual one 
    const articles = await Article.find().sort({createdAt : -1})
    res.render('articles/index', { articles : articles });
})

app.use('/articles', articleRouter);



app.listen(3000);