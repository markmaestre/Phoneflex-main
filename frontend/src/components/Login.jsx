import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Link, Box } from '@mui/material';
import './css/login.css'; 

const Login = () => {
  const navigate = useNavigate();

 
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('http://localhost:5000/api/auth/login', values);
        const { token, user } = res.data;

        localStorage.setItem('token', token);

        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
      } catch (err) {
        if (err.response && err.response.data) {
          formik.setErrors({ server: err.response.data.msg });
        }
      }
    },
  });

  return (
    <Box className="login-form" sx={{ maxWidth: 400, margin: '0 auto', padding: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">Login</Typography>

      <form onSubmit={formik.handleSubmit}>
  
        <TextField
          fullWidth
          type="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        {/* Password Field */}
        <TextField
          fullWidth
          type="password"
          name="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />

        {/* Server Error Message */}
        {formik.errors.server && <Typography color="error" variant="body2" align="center">{formik.errors.server}</Typography>}

        {/* Remember Me */}
        <FormControlLabel
          control={<Checkbox />}
          label="Remember me"
          sx={{ display: 'block', marginTop: 2 }}
        />

   
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Log in
        </Button>

       
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Link href="/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Box>

    
        <Box sx={{ textAlign: 'center', marginTop: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link href="/register">Register</Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
