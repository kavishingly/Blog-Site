
const express = require("express");
const Mongoose = require("mongoose");
// Mongoose.connect("mongodb://localhost:27017/blogposts")
const url="mongodb+srv://kavish-blog:kavish-blog@cluster0.5zzzm.mongodb.net/blogposts?retryWrites=true&w=majority"
Mongoose.connect(url);
// const bodyParser = require("body-parser"); 
//Body parser  is deprecated, we can now get body using express only!!!
const ejs = require("ejs");
const _ = require("lodash")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
 
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//db schema
const blogSchema = {
  title: String,
  body: String
}
const Post = Mongoose.model("Post", blogSchema);

const post1 = new Post({
  title: "Testing",
  body: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusantium incidunt ab rem esse? Hic porro molestiae ea sint esse consectetur, perspiciatis libero error repellat eveniet dolores quo ratione, rerum ipsum!"
})

// post1.save();


app.get("/", (req, res) => {
  Post.find({}, (err, postArray) => {
    if (!err) {


      res.render("home", { homeStartingContent, posts: postArray })
    }
  })
})
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent })
})
app.get("/contact", (req, res) => {
  // res.render("contact",{contactContent:contactContent})
  //both params are same, we just write like =>
  res.render("contact", { contactContent })
})
app.get("/compose", (req, res) => {
  res.render("compose")
})
app.get("/posts/:category", (req, res) => {

  // const requestedTitle = _.lowerCase(req.params.category)
  const requestedTitle = req.params.category
  //find a document having title as requestedTitle
  Post.find({title:requestedTitle},(err,foundPost)=>{ //this returns an array with one element
    if(err){
      console.log(err);
    }else{
      res.render("post", { customPostTitle: foundPost[0].title, customPostBody: foundPost[0].body })
      
    }
  })
  

})
app.post("/compose", (req, res) => {
  let postTitle = req.body.postTitle //postTitle is name attribute of input tag
  let postBody = req.body.postBody //postBody is name attribute of input tag
  const newPost = new Post({
    title: postTitle,
    body: postBody
  });
  newPost.save((err)=>{
    if(!err){

      res.redirect("/");
    }
  });
})

app.post("/deletePost",(req,res)=>{
  let deleteTitle=req.body.deletePostBtn;
  Post.deleteOne({ title: deleteTitle }).then(function(){
    console.log("Post deleted"); // Success
    res.redirect("/")
  }).catch(function(error){
    console.log(error); // Failure
  });
})










app.listen(3000, function () {
  console.log("Server started on port 3000");
});
