// pages/upload.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const router= useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);

      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Post uploaded successfully!');
    router.push('/feed');
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Error uploading post. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Upload a Photos on miniINSTAGRAM
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <input type="file" onChange={handleFileChange} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description (optional)"

            variant="outlined"
            fullWidth
            value={description}
            margin='normal'
            onChange={handleDescriptionChange}

          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Upload;
