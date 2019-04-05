var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var express=require("express");
var methodOverride=require("method-override");
var app=express();
mongoose.connect("mongodb://localhost/blog");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created:{type: Date, default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);
app.get("/",function(req, res) {
    res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
       if(err){
           console.log("ERROR!");
       }else{
           res.render("index",{blogs: blogs});
       }
   });
});
app.get("/blogs/new",function(req,res){
   res.render("new"); 
});
app.post("/blogs",function(req,res){
   Blog.create(req.body.blogs,function(err,newblog){
     if(err){
         res.render("new");
     }
     else{
         res.redirect("/blogs");
     }
   });
});
app.get("/blogs/:id",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
               res.redirect("/blogs");
               }
        else{
            res.render("show",{blogs: foundBlog});
        }       
   });
});
app.get("/blogs/:id/edit",function(req,res){
   Blog.findById(req.params.id,function(err,foundBlog){
      if(err){
          res.redirect("/blogs");
      } 
      else{
          res.render("edit",{blogs:foundBlog});
      }
   });
});
app.put("/blogs/:id",function(req,res){
   Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedblog){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.redirect("/blogs/"+req.params.id);
       }
    });
});
app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,req.body.blogs,function(err,updatedblog){
       if(err){
           res.redirect("/blogs");
       }
       else{
           res.redirect("/blogs");
       } 
});
});
const port=3000;
app.listen(port,()=>{
console.log("server started at port "+port);
});