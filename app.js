var redis = require("redis");
const express = require("express");
const bodyParser = require("body-parser")

const session = require('express-session');
const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session)
const fs = require('fs');


const cors = require('cors');
const app = express();
//const appl = express();
const port = 5200;

// var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// app.use(cors());

app.use(express.static('public'));
app.use(require('cookie-parser')());


const { async } = require('regenerator-runtime');
const { message } = require("statuses");
const { cat } = require("shelljs");
const { string } = require("yargs");
const { object } = require("assert-plus");
//create client
const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: '6379'
    }

});

// app.use(session({
//   store: new RedisStore({ client: client }),
//   secret: 'secret$%^134',
//   resave: false,
//   saveUninitialized: false
// }))


client.connect();

client.on("connect", function () {
    console.log("Redis Connection Successful!!");
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });
 
const uid = (() => (id = 1, () => id++))();
const userchannel1 = 'chan1nel';
const userchannel2 = 'chan2nel';

// New app using express module

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/main.html");
});

app.get("/redis", function (req, res) {
  res.sendFile(__dirname + "/redis.html");
});

app.get("/update", function (req, res) {
  res.sendFile(__dirname + "/show.html");
});

// app.get("/showAll", function (req, res) {
//   res.sendFile(__dirname + "/showall.html");
// });

app.get("/show", function (req, res) {
  res.sendFile(__dirname + "/show.html");
});

app.get("/loginPage", function (req, res) {
  res.sendFile(__dirname + "/login.html");
});

app.use(session({
  secret: 'your_secret_key_here',
  resave: false,
  saveUninitialized: true
}));

app.post("/register", jsonParser,async function (req, res) {

    console.log('fetching data..')  
    // let keyname = "new";

    let object = {

    //   fname:'Prachichanne',
    //   phone:24234,
    //   bio:'student',
    //   addr:'pune'
    // var id  = req.body.id ;
    // var fname = req.body.fname ;
    // var phone = req.body.phone ;
    // var bio = req.body.Bio ;
    // var addr = req.body.addr ;

     
     psw : req.body.psw,
     //id  : req.body.id,
     email : req.body.email,
     fname : req.body.fname ,
     phone : req.body.phone ,
     bio : req.body.bio ,
     addr : req.body.addr 


    

    // myData.push({
    //     'id':id,
    //     'fname':fname,
    //     'phone':phone,
    //     'bio':bio,
    //     'addr':addr
    // });

    }

    // email: req.body.email;

    // let responseArray=' ';
    // console.log('set cache',object1)
    //client.set(keyname,JSON.stringify(myData));
    //res.send(myData)
  
     
  
    // client.incr('id',(err, id) => {
    //       if (err) {
    //         console.error(err);
    //       } else {
            
           //const value = uid();
            //var id = 0;
           // idAutoIncrement(id)
             const key = req.body.email;
           // const key = value;
             client.hSet('myhash',key, JSON.stringify(object), (err, reply) => {
              if (err) {
                console.error(err);
              } else {
                console.log("reply"); // Output: OK
              }
            });
        
        //  }
        // });
     

    responseArray = object;

    await client.publish('userchannel1',"Data submitted by "+object.fname)
    
     console.log(responseArray);
   res.status(200).json();
   
    //res.redirect('/home');     

});


app.post('/login',jsonParser,async function(req,res){


      //const sess = req.session;

      let obj = {  email : req.body.email , psw:req.body.psw };
      //req.session.userId = obj.email;
      


       //sess.username = obj.email;
      // sess.psw = obj.psw;
      // console.log(sess.username)
      let key = obj.email;
      
      // console.log("email valid"+ key)
      let val = await client.hGet("myhash", key);
      if(val){
        myData = JSON.parse(val)

        if(myData.psw==obj.psw){
          console.log("sucessful login")
          // req.session.user = {
       
          //   email: obj.email,
          //   psw:obj.psw
    
          // };

          fs.writeFile('obj.json', JSON.stringify(obj), err => {
            if (err) throw err;
            console.log('Data saved to file');
          }); 

          // req.session.user = obj.email;
          // console.log(req.session.user)
          //window.localStorage.setItem("myObject", obj.email);

          res.redirect('/home');  
        
        }else{
            res.send("wrong password")
        }
    
        //if(obj.email)
      }
      else{
        console.log("Email does not exist")
        return res.send({
          message: "Invalid email"
      })

  }
  
      

})

app.get("/details", async function (req, res) {

  // const sess = req.session;
  // console.log(sess.username)
    //let key = req.session.userId;

   // const user = window.localStorage.setItem("myObject", obj.email);

    // const user = req.session.user;
    // console.log("user : "+ user)
    
    fs.readFile('obj.json',async (err, data) => {
      if (err) throw err;
      const obj = JSON.parse(data);
       var user = obj.email;
       let val = await client.hGet("myhash",user);
       myData = JSON.parse(val)
       console.log("get cache",myData)
   
       
       const fname = myData.fname;
       let phone = myData.phone;
       let bio = myData.bio;
       let addr = myData.addr;
       
      // res.send("<html> <head>Server Response</head><br><body><h3>FirstName : "+fname+"<br>Phone : "+phone+"<br>Bio : "+bio+"<br>Address : "+addr+"<br></h3></body></html>")
      await client.publish('userchannel1',"Data Fetched")
      res.send(myData);
    });

  //   let val = await client.hGet("myhash",user);
  //   myData = JSON.parse(val)
  //   console.log("get cache",myData)

    
  //   const fname = myData.fname;
  //   let phone = myData.phone;
  //   let bio = myData.bio;
  //   let addr = myData.addr;
    
  //  // res.send("<html> <head>Server Response</head><br><body><h3>FirstName : "+fname+"<br>Phone : "+phone+"<br>Bio : "+bio+"<br>Address : "+addr+"<br></h3></body></html>")
  //  await client.publish('userchannel1',"Data Fetched")
  //  res.send(myData);
   


});


app.post("/update",jsonParser,async function(req,res){

  fs.readFile('obj.json',async (err, data) => {

    if (err) throw err;
    const obj = JSON.parse(data);
     var user = obj.email;

  console.log(user)

  let val = await client.hGet("myhash",user);
  myData = JSON.parse(val)

  

  let psw = myData.psw;
  let email = myData.email;

  let object = {
   // psw : req.body.psw,
     //id  : req.body.id,
    // email : req.body.email,
     psw : psw,
     email:email,
     fname : req.body.fname ,
     phone : req.body.phone ,
     bio : req.body.bio ,
     addr : req.body.addr 

  }

  // console.log(user)
  // console.log(JSON.stringify(object))

  client.hSet('myhash',user, JSON.stringify(object), (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      console.log("reply"); // Output: OK
    }

  });

  res.redirect("/show")
  console.log("updated");
})
 // res.send("<html> <head>Server Response</head><br><body><h3>FirstName : "+fname+"<br>Phone : "+phone+"<br>Bio : "+bio+"<br>Address : "+addr+"<br></h3></body></html>")
 // await client.publish('userchannel1',"Data Updated")



})

// app.post("/destroy",async function(req,res){
//   req.session.destroy
// })

// Get profile by ID
app.get('/showAll', async function(req,res){
  
   var obj = await client.hGetAll('myhash')
   myData = JSON.parse(obj)
       console.log(myData);
 
      res.send(myData)
});


app.post("/search",jsonParser,async function(req, res){
    
    let id = req.body.id;
  
    let getData = await client.get("new");
    res.send(getData)
    await client.publish('userchannel1',"Data Searched")


});

app.delete("/delete", async function(req, res){

//     let id = req.body.id; 
//    await client.del("new");
   
//    await client.publish('userchannel1',"Data Deleted")
//    res.status(200).json();


   const key = 'myhash';
const field = 'object:8';


  if (client.hDel(key, field)){
    console.error("Deleted field(s) from db.");
  } else {
    console.log(err);
  }
});

  
app.delete('/deleteAll', async function(req,res){

  
if (client.del('myhash')){
  
  console.log('Deleted objects from myHash');
}
else{
  console.log("Error"+ err)
}
});
    



// Socket Connection
// UI Stuff
io.on('connection', function (socket) {

    console.log("connected")
    // Fire 'send' event for updating Message list in UI
    socket.on('message', function (data) {
        io.emit('send', data);
    });

    // // Fire 'count_chatters' for updating Chatter Count in UI
    // socket.on('update_chatter_count', function (data) {
    //     io.emit('count_chatters', data);
    // });

});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));


























// app.post('/details', jsonParser,async function(req, res, next){

//     let id = req.body.id;
//     let fname = req.body.fname;
//     let phone = req.body.phone;
//     let email = req.body.email;
//     let bio = req.body.Bio;
  
    
//     client.hSet(id, [
//       'fname', fname,
//       'bio', bio,
//       'email', email,
//       'phone', phone
//     ], function(err, reply){
//       if(err){
//         console.log(err);
//       }
//       console.log(reply);
//       res.redirect('/');
//     });
//   });




// client.set('foo', 'bar', (err, reply) => {
    // if (err) throw err;
    // console.log(reply);

    // client.get('foo', (err, reply) => {
    //     if (err) throw err;
    //     console.log(reply);
    // });
// });





// client.on('error', err => {
//     console.log('Error ' + err);
// });
// client.set("name", "Flavio")
// client.set("age", 37)


// client.set("Intern", "gfg", (err, stu) => {
//     if (err) console.log(err);
//     else console.log(stu);
// });

