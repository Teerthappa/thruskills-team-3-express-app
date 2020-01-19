var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/* GET home page. */
router.get('/',function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    // get the projects
    dbo.collection('projects').find({}).limit(3).toArray(function(err, projects){
      if (err) throw err;
      console.log(JSON.stringify(projects));
// get the posts
      dbo.collection('posts').find({}).limit(3).toArray(function(err, posts){
        if (err) throw err;
        console.log(JSON.stringify(posts));
      db.close();
      res.render('index', { title: 'Portfolio | Mr.Teertha', 'indexNav': true, projects: projects, posts: posts});
    })
  })
  });   
 
})
/* GET project page with data*/
router.get('/projects', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    dbo.collection('projects').find().toArray(function(err, data){
      if (err) throw err;
      console.log(JSON.stringify(data));
      db.close();
      res.render('projects', { title: 'Projects | Mr.Teertha', 'projectsNav': true, projects: data});
    })
  });
  
});
router.get('/projects/:id', function(req, res){
  let id = parseInt(req.params.id);
  console.log('id --- > ', typeof id);
  //  once you got the project id
  // make the database call to check if it exists  
  if(id < data.length ){
    res.render('project-detail', { data : data[id] })
  }else{
    // 404 
    console.log('page not found')
    res.send('Page not found')
  }
})
/* GET blog page with data*/
router.get('/blog', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("portfolio");
    let d = new Date();
    dbo.collection('post').find().toArray(function(err, post){
      if (err) throw err;
      console.log(JSON.stringify(post));
      db.close();
      res.render('blog', { title: 'Blog | Mr.Teertha', 'blogNav': true, post: post});
    })
  });
});
/* GET About page.*/
router.get('/about', function(req, res){
  res.render('about', {title: 'About | Mr.Teertha', 'aboutNav': true});
})
/* GET Contact page.*/
router.get('/contact', function(req, res){
  res.render('contact', {title: 'Contact | Mr.Teertha', 'contactNav': true});
})

router.post('/contact', [
    check('email').isEmail().withMessage('Please enter a valid email id'),
    check('mobile').isLength({ min: 10 }).withMessage('Mobile  number must be atleast 10 characters')
  ],
  function(req, res){
    const errors = validationResult(req);
    console.log(JSON.stringify(errors))
    if(!errors.isEmpty()){
      var messages = [];
      errors.errors.forEach(function(err){
        console.log(JSON.stringify(err))
        messages.push(err.msg)
      })
      let name = req.body.name;
      let mobile = req.body.mobile;
      let email = req.body.email;
      let description = req.body.description;

      res.render('contact', {errors: true, messages: messages, name, mobile, email, description});
    }else{
      // read the values and save it in the DB

      res.render('contact', {success: true});
    }
})
module.exports = router;
