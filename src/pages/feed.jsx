
import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';
import { Button } from '@mui/material';


const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [commentInput,setCommentInput]= useState('');
  const socket = io('http://localhost:5000');



  useEffect(() => {

    socket.on('postUpdated', (updatedPost) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
    });


    return () => {
      socket.disconnect();
    };
  }, [socket]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: [...post.likes, 'dummyUserId'] } : post
        )
      );

    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { comment });


      const response = await axios.post(`http://localhost:5000/api/posts/${postId}comment`);

      const updatedPost = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, comments: [...post.comments, 'dummyUserId'] } : post
        ))

       setCommentInput('');

    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };
   const handleDelete = async (postId)=>{
    try{
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts((prevPosts)=> prevPosts.filter((post)=> post._id !== postId));
    }catch (error){
      console.error(`error deleting post :` , error);

    }
    };

    const handleDeleteComment = async (postId, commentId) => {
  try {
    await axios.delete(`http://localhost:5000/api/posts/${postId}/comments/${commentId}`);

    const response = await axios.get(`http://localhost:5000/api/posts/${postId}`);
    const updatedPost = response.data;

    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};


  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
         miniINSTAGRAM
      </Typography>
      {posts.map((post) => (


        <Card
        key={post._id} style={{ marginBottom: '20px' }}>
          <CardMedia component="img" height="100" image={`http://localhost:5000/uploads/${post.image}`} alt={post.description} />
          <CardContent>
            <Typography variant="h6">{post.description}</Typography>
            <Typography variant="body2">Likes: {post.likes.length}</Typography>

            <Button style={{ color: post.liked ? 'red' : 'black' }} variant="contained" color="primary" onClick={() => handleLike(post._id)}>Like</Button>
            <div>
            <Typography variant="h6">Comment:</Typography>
              {post.comments.map((comment, index) => (
                <Typography key={index} variant="body2">{comment}</Typography>
              ))}
            </div>
            {post.comments.map((comment) => (
        <div key={comment._id}>
    <Typography variant="body2">{comment.text}</Typography>
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleDeleteComment(post._id, comment._id)}
       >
      Delete Comment
       </Button>
      </div>
    ))}

            <TextField variant="outlined" placeholder="Add a comment" value={commentInput} onChange={(e) =>setCommentInput(e.target.value)} />

            <Button variant="contained" color="primary" onClick={()=> handleComment(post._id,commentInput)}>Comment</Button>
          <hr />

<br /><br />
            <Button variant="contained" color="secondary" onClick={()=>
              handleDelete(post._id)}>DeletePost</Button>


          </CardContent>
        </Card>
      ))}
    </Container>


  );
};

export default Feed;
