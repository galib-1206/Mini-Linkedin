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



const minioClient = require ('./minioClient') ;

const bucketName = "minilinkedin";

(async () => {
    console.log(`Creating Bucket: ${bucketName}`);
    await minioClient.makeBucket(bucketName, "hello-there").catch((e) => {
        console.log(
            `Error while creating bucket '${bucketName}': ${e.message}`
        );
    });

    console.log(`Listing all buckets...`);
    const bucketsList = await minioClient.listBuckets();
    console.log(
        `Buckets List: ${bucketsList.map((bucket) => bucket.name).join(",\t")}`
    );
})();

app.use(cors({credentials:true,origin:'*'}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb://mongodb:27017');



app.post('/api/register', async (req,res) => {
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


app.post('/api/login', async (req,res) => {
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


app.get('/api/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) return;
    res.json(info);
  });
});


app.post('/api/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


app.post('/api/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  minioClient.fPutObject('minilinkedin', newPath, path, async function (error) {
    if (error) {
        return { status: 400 };
    }
    fs.unlinkSync(path);
});

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    //create the post 
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });

  
  // const usersToNotify = await User.find({ _id: { $ne: info.id } });
  // for (const user of usersToNotify) {
  //   await Notification.create({
  //     sender: info.id,
  //     receiver: user._id,
  //     type: 'post_created',
  //     post: postDoc._id,
  //   });
  // }
    res.json(postDoc);
  });

});

// /////////Notification 
// app.get('/api/notifications', async (req, res) => {
//   // Fetch notifications from your database
//   const notifications = await Notification.find().populate('sender');

//   res.json(notifications);
// });



app.put('/api/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.update({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});

app.get('/api/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/api/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})



app.listen(4000);
