'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';

export default function BusinessProfilePage() {
  const { userDetailsId } = useParams<{ userDetailsId: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phoneNumber: '',
    website: '',
    description: '',
    logoUrl: '',
    industryId: '',
    nipt: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const businessProfileData = {
      ...formData,
      industryId: Number(formData.industryId),
      userDetailsId: Number(userDetailsId),
    };

    try {
      const response = await fetch('/api/BussinesProfiles/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessProfileData),
      });

      if (!response.ok) {
        throw new Error('Failed to create business profile');
      }

      const data = await response.json();
      toast.success('Business profile created successfully! 🎉');

      // Opcionale: redirect pas 2 sekonda
      setTimeout(() => {
        router.push('/dashboard/users');
      }, 2000);

    } catch (error) {
      toast.error('Failed to create business profile ❌');
      console.error('Error creating business profile:', error);
    }
  };

  return (
    <Container maxWidth="sm" className="py-8">
      <ToastContainer position="top-center" autoClose={3000} />

      <Typography variant="h4" component="h1" gutterBottom>
        Create Business Profile
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Name"
              variant="outlined"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Website"
              variant="outlined"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Logo URL"
              variant="outlined"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Industry ID"
              variant="outlined"
              name="industryId"
              value={formData.industryId}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nipt"
              variant="outlined"
              name="nipt"
              value={formData.nipt}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Create Business Profile
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
