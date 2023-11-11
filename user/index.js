const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials:true,origin:'*'}));
app.use(express.json());
app.use(cookieParser());
app.use('/user/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb://usermongodb:27017');



app.post('/user/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});


app.post('/user/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});


app.get('/user/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) return;
    res.json(info);
  });
});


app.post('/user/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


// app.post('/user/post', uploadMiddleware.single('file'), async (req,res) => {
//   const {originalname,path} = req.file;
//   const parts = originalname.split('.');
//   const ext = parts[parts.length - 1];
//   const newPath = path+'.'+ext;
//   fs.renameSync(path, newPath);

//   minioClient.fPutObject('minilinkedin', newPath, path, async function (error) {
//     if (error) {
//         return { status: 400 };
//     }
//     fs.unlinkSync(path);
// });

// const {token} = req.cookies;
// jwt.verify(token, secret, {}, async (err,info) => {
//   if (err) throw err;
//   const {title,summary,content} = req.body;
//   //create the post 
//   const postDoc = await Post.create({
//     title,
//     summary,
//     content,
//     cover:newPath,
//     author:info.id,
//   });


//   res.json(postDoc);
// });

// });


// app.get('/user/post', async (req,res) => {
//   res.json(
//     await Post.find()
//       .populate('author', ['username'])
//       .sort({createdAt: -1})
//       .limit(20)
//   );
// });

// app.get('/user/post/:id', async (req, res) => {
//   const {id} = req.params;
//   const postDoc = await Post.findById(id).populate('author', ['username']);
//   res.json(postDoc);
// })

app.listen(4000);
