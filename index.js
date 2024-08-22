require('dotenv').config()
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8000
const path = require("path")
const userRoutes = require("./routes/user")
const blogRoutes = require("./routes/blog")
const Blog = require('./models/blog')
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { checkForAuthenticationCookie } = require("./middleware/auth")

mongoose.connect(process.env.MONGO_URL)
.then(() =>{console.log(`Connected To MOngoDb`);
})
.catch(err =>{console.log(err)});

app.set('view engine', 'ejs')
app.set('views' , path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser()); 
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get("/", async (req, res) => {   
    const allBlogs = await Blog.find({})
    res.render("home", {
        user: req.user,
        blogs : allBlogs 
    });
})

app.use("/user", userRoutes) 
app.use("/blog", blogRoutes)


app.listen(PORT, ()=>{
    console.log(`listening on ${PORT}`);
})