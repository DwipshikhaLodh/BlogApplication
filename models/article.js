const mongoose = require('mongoose')
const {marked} = require('marked') // conversion of markdown to html
const slugify = require('slugify')
const createDomPurifier = require('dompurify')
const {JSDOM} = require('jsdom')

const dompurify = createDomPurifier(new JSDOM().window) //sanitize the html through JSDOM().window object

const articleSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : {
        type : String
    },
    markdown : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    slug : {
        type : String, 
        required : true,
        unique : true
    },
    sanitizedHTML : {
        type : String,
        required : true
    }
})

articleSchema.pre('validate', function(next) {
    if(this.title){
        this.slug = slugify(this.title, { lower : true, strict : true})
    }
    if(this.markdown){
        this.sanitizedHTML = dompurify.sanitize(marked.parse(this.markdown))
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)

// before using slug, the id appears in the url which doesn't look good & so we'll use slug(different version of out article's title)

// after creating slug, in the articles.js , we need to put slug in place of id
// for conversion of markdown to html we need to keep in mind that html must get sanitized so along with marked, we also need some other library dompurify & it requires jsdom. npm i dompurify jsdom