const { Router } = require("express");
const router = Router();
const multer = require('multer')
const path = require('path')
const Comment = require('../models/comment')
const Blog = require('../models/blog')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null , fileName)
    }
  })

  const upload = multer({ storage: storage })

router.get("/add-new" , upload.single("coverImageURL"),(req,res) => {
    return res.render("addBlog" , {
        user : req.user,
    })
})

router.get("/:id" , async (req,res) => {
    const comments = await Comment.find({ blogId : req.params.id }).populate("createdBy")
    const blog = await Blog.findById(req.params.id).populate("cretedBy");
    return res.render("blog", {
        blog,
        user : req.user,
        comments,
    })

})


router.post("/", upload.single("coverImageURL"), async (req, res) => {
    const { title , body } = req.body
    const blog = await Blog.create({
        body,
        title,
        cretedBy : req.user._id,
        coverImageURL : `/uploads/${req.file.filename}`,
    })

    if (req.file) {
        console.log(`File uploaded to: /uploads/${req.file.filename}`);
    } else {
        console.log('No file uploaded.');
    }

    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId" , async (req,res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id 
    })
    res.redirect(`/blog/${req.params.blogId}`)
})


module.exports = router;