'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert, // Importing Alert for displaying error messages
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../../context/authContext';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
});

export default function SignUp() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { login, signup } = useAuth();

  const handleSubmit = async (
    values: { firstName: string; lastName: string; email: string; password: string },
    { setSubmitting, setErrors }: FormikHelpers<any>
  ) => {
    setServerError(''); // Clear previous server error
    try {
      await signup(values.firstName, values.lastName, values.email, values.password);
      await login(values.email, values.password);
      router.push('/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.response && error.response.data) {
        setServerError(error.response.data.error); // Set server error
      }
    }
    setSubmitting(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign up
        </Typography>
        {serverError && <Alert sx={{m:3}} severity="error">{serverError}</Alert>}
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="firstName"
                    variant="outlined"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    helperText={<ErrorMessage name="firstName" />}
                    error={touched.firstName && !!errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    name="lastName"
                    variant="outlined"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    helperText={<ErrorMessage name="lastName" />}
                    error={touched.lastName && !!errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    label="Email Address"
                    helperText={<ErrorMessage name="email" />}
                    error={touched.email && !!errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    id="password"
                    label="Password"
                    helperText={<ErrorMessage name="password" />}
                    error={touched.password && !!errors.password}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
