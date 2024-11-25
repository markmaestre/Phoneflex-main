import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, Box } from "@mui/material";
import './css/register.css';

function RegisterForm() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            image: null,
            address: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string().required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
            role: Yup.string().required("Role selection is required"),
            image: Yup.mixed().required("Profile image is required"),
            address: Yup.string().required("Address is required"),
        }),
        onSubmit: async (values) => {
            const formDataToSend = new FormData();
            formDataToSend.append("name", values.name);
            formDataToSend.append("email", values.email);
            formDataToSend.append("password", values.password);
            formDataToSend.append("confirmPassword", values.confirmPassword);
            formDataToSend.append("role", values.role);
            formDataToSend.append("image", values.image);
            formDataToSend.append("address", values.address);

            try {
                await axios.post('http://localhost:5000/api/auth/register', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                navigate("/login");
            } catch (err) {
                console.error(err.response.data);
            }
        },
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} className="register-form" sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
            <h2>Register</h2>

            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ marginBottom: 2 }}
            />

            <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{ marginBottom: 2 }}
            />

            <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={{ marginBottom: 2 }}
            />

            <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                sx={{ marginBottom: 2 }}
            />

            <FormControl fullWidth sx={{ marginBottom: 2 }} error={formik.touched.role && Boolean(formik.errors.role)}>
                <InputLabel>Role</InputLabel>
                <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Role"
                >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
            </FormControl>

            <div className="form-field">
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])}
                />
                {formik.touched.image && formik.errors.image && <span className="error">{formik.errors.image}</span>}
            </div>

            <TextField
                fullWidth
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{ marginBottom: 2 }}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={formik.isSubmitting}
            >
                {formik.isSubmitting ? "Registering..." : "Register"}
            </Button>
        </Box>
    );
}

export default RegisterForm;
