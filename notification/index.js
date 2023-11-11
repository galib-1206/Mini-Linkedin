const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const Notification = require('./models/Notification');

const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';



// const minioClient = require ('./minioClient') ;

// const bucketName = "minilinkedin";

// (async () => {
//     console.log(`Creating Bucket: ${bucketName}`);
//     await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
//         console.log(
//             `Error while creating bucket '${bucketName}': ${e.message}`
//         );
//     });

//     console.log(`Listing all buckets...`);
//     const bucketsList = await minioClient.listBuckets();
//     console.log(
//         `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
//     );
// })();

app.use(cors({credentials:true,origin:'*'}));
app.use(express.json());
app.use(cookieParser());
app.use('/notification/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb://notificationmongodb:27017');



// app.post('/notification/register', async (req,res) => {
//   const {username,password} = req.body;
//   try{
//     const userDoc = await User.create({
//       username,
//       password:bcrypt.hashSync(password,salt),
//     });
//     res.json(userDoc);
//   } catch(e) {
//     console.log(e);
//     res.status(400).json(e);
//   }
// });


// app.post('/notification/login', async (req,res) => {
//   const {username,password} = req.body;
//   const userDoc = await User.findOne({username});
//   const passOk = bcrypt.compareSync(password, userDoc.password);
//   if (passOk) {
//     // logged in
//     jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
//       if (err) throw err;
//       res.cookie('token', token).json({
//         id:userDoc._id,
//         username,
//       });
//     });
//   } else {
//     res.status(400).json('wrong credentials');
//   }
// });


// app.get('/notification/profile', (req,res) => {
//   const {token} = req.cookies;
//   jwt.verify(token, secret, {}, (err,info) => {
//     if (err) return;
//     res.json(info);
//   });
// });


// app.post('/notification/logout', (req,res) => {
//   res.cookie('token', '').json('ok');
// });


//post req to create notification 
app.post('/notification/post',  async (req,res) => {
  const username = req.body.username;
  const title = req.body.title;
  console.log(req.body.username);
  Notification.create({
    username:username,
    title:title
  });
});


//get req to retrieve a list of notifications 
//notification.find() func to query the db for all notification documents.
app.get('/notification/notifications', async (req, res) => {
  
  const notifications = await Notification.find();

  res.json(notifications);
});


app.listen(4000);
