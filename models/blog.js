const { Schema, model, models } = require('mongoose')

const blogSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    body : {
        type : String,
        required : true,
    },
    coverImageURL : {
        type : String,
    },
    cretedBy : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    }
},{
    timestamps : true,
})

const Blog = model('blog' , blogSchema)

module.exports = Blog;