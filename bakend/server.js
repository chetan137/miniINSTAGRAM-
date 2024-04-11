
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Post } = require('./models/Post');
const sockets = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);



const PORT = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

const db = require('./config/db');
db.connect();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


app.post('/api/posts', upload.single('file'), async (req, res) => {
  try {
    const { description } = req.body;
    const imageUrl = req.file.filename;

    const newPost = new Post({
      description,
      image: imageUrl,
      likes: [],
      comments: [],
    });
    await newPost.save();

    io.emit('postUpdated', newPost);

    res.status(200).send('Post uploaded successfully');
  } catch (error) {
    console.error('Error uploading post:', error);
    res.status(500).send('Server error');
  }
});



app.post('/api/posts/:postId/like', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    post.likes.push(req.body.userId);
    await post.save();

    io.emit('postUpdated', post);

    res.status(200).send('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send('Server error');
  }
});


app.post('/api/posts/:postId/comment', async (req, res) => {
  try {
    const postId= req.params.postId;
  const post = await Post.findById(postId);
    const {comment} = req.body;

    if (!post) {
      return res.status(404).send('Post not found');
    }
    const updatedPost=await Post.findByIdAndUpdate(postId,
    {$push:{comments:comment}},
    {new:true}
    );


    await post.save();

    io.emit('postUpdated', post);

    res.status(200).send('Comment added successfully');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Server error');
  }
});
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Server error');
  }
});



app.delete('/api/posts/:postId', async (req, res) => {
    try {

        const {postId} = req.params;
        await Post.findByIdAndDelete(postId);
        io.emit('postDeleted',postId);
                res.status(200).send('post deleted successfully');


            } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).send('server error ' );
    }
});

app.delete('/api/posts/:postId/comments/:commentId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const updatedPost = await Post.findByIdAndUpdate(postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Server error');
  }
});





sockets(io);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
