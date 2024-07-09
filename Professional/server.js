
const { render } = require("ejs");
const express=require("express");
const firebase=require("./models/firebaseconnection");

const bodyparse=require('body-parser');
const csrf=require("csurf");

const upload=require("express-fileupload");
var Port=process.env.PORT||5000;
const cookieparser=require('cookie-parser');
//Firebase Admin

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://atyourdoor-2182d-default-rtdb.firebaseio.com"
});




const app=express();

const csrfMiddleware=csrf({cookie:true});
// File Sytem

const fs=require("fs");
// Sql Database 

const mysql=require("./models/mysqlconnection");



app.use(bodyparse.json());
app.use(cookieparser());
app.use(upload());
app.engine("html",require('ejs').renderFile);
app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));


app.post("/insert",function(req,res){
  
  
  var query="select*from pro";
  mysql.query(query,function(err,result){

    const pro_id=result.length+1;
    //Storing data in MySql
    var insertQuery="insert into pro values("+pro_id+","+"'"+req.body.formdata.fullname.toString()+"','"+req.body.formdata.email.toString()+"','"+req.body.formdata.skill.toString()+"','"+req.body.formdata.aboutme.toString()+"')";
    mysql.query(insertQuery,function(err,result){
      if(err) console.log(err);

      console.log("Data Saved"+JSON.stringify(result));

  })

       fs.writeFileSync("./data/proid.json",JSON.stringify({proid:pro_id}));

      
  });

  res.redirect("/");
})



app.use(csrfMiddleware);
app.all("*",(req,res,next)=>{

    res.cookie("XSRF-TOKEN",req.csrfToken());
    console.log("Ok\t"+req.csrfToken());
    next();
    
});


app.get('/', function(req,res){

  if(req.cookies.session!=undefined){
      res.status(401).render("NotAuthorized.html");
      //fs.writeFileSync("./data/log.json",JSON.stringify({logged:true}));
      
  }
  else{
     // fs.writeFileSync("./data/log.json",JSON.stringify({logged:false}));
     res.render("pro_register.html");
  }
  
 
});









app.post("/sessionLogin",(req,res)=>{

  
  var query="select* from pro where Email='"+req.body.formdata.Email.toString()+"'";

 
  mysql.query(query,(error,result)=>{

    if(error) {console.log(error)}
    else if(result.length>0){
      const idToken=req.body.idToken.toString();
      //const csrfToken=req.body.csrfToken.toString();

      
      //console.log(result[0].pro_id);
      const expiresIn=60*60*24*5*1000;

      admin.auth().createSessionCookie(idToken,{expiresIn})
      .then(
          (sessionCookie)=>{
              const options={maxAge:expiresIn,httpOnly:true,secure:true};
              res.cookie('session',sessionCookie,options);
              fs.writeFileSync("./data/loggedPro.json",JSON.stringify({proid:result[0].pro_id}));
              res.end(JSON.stringify({status:"Success"}));
          },
          (error)=>{
              res.status(401).send("UNAUTHORIZED REQUEST!");
          });

    }
    else{
      console.log("NO Such user registered");
      res.send("NO Such User Exist")
    }
    
  })

  
})




app.get("/sessionlogout",function(req,res){
  res.clearCookie("session");
  //fs.writeFileSync("./data/log.json",JSON.stringify({logged:false}));
  res.redirect("/");
  
});


app.get("/index",function(req,res){
  if(req.cookies.session!=undefined){
    
    res.render("index.html");
    //fs.writeFileSync("./data/log.json",JSON.stringify({logged:true}));
    
}
else{
   // fs.writeFileSync("./data/log.json",JSON.stringify({logged:false}));
   res.status(401).render("NotAuthorized.html");
}
  
})

app.use(function(req,res){
  res.status(404).render('NotFound.html');
});


app.listen(Port,console.log("Server Running 4000"));