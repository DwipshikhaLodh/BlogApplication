const express = require('express');
const article = require('./../models/article');
const router = express.Router()
const Article = require('./../models/article')


router.get('/new', (req, res) => {
    res.render('articles/new', {article : new Article()})
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article : article} )
})

router.get('/:slug', async(req, res) => {
    const article = await Article.findOne({ slug : req.params.slug}) //findOne is used as it gets an array

    if(article == null){
        res.redirect('/')
    }else{
        res.render('articles/show', {article : article})
    }
})

router.post('/', async (req, res, next) => {
    // before implementing edit feature i.e., put route
    //let article = new Article({
    //    title : req.body.title,
    //    description : req.body.description,
    //    markdown : req.body.markdown
    //})

    //try{
    //    article = await article.save()
    //    res.redirect(`/articles/${article.slug}`)
    //}catch (e) {
    //    console.log(e.message)
    //    res.render('articles/new', { article : article})
    //}

    req.article = new Article()
    next()
    
}, saveOrUpdateArticle('new'))

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveOrUpdateArticle('edit'))

function saveOrUpdateArticle(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown

        try{
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }catch (e){
            res.render(`articles/${path}`, { article : article})
        }
    }
}

// now to create a route for delete method, for deleting articles
// but we have only get method on a link & get&post method on a form so we need a library called "method-override" // this allows us to use put, patch, delete method 

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


module.exports = router;
