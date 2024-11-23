import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        <form onSubmit={formik.handleSubmit} className="register-form">
            <h2>Register</h2>

            <div className="form-field">
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && <span className="error">{formik.errors.name}</span>}
            </div>

            <div className="form-field">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && <span className="error">{formik.errors.email}</span>}
            </div>

            <div className="form-field">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && <span className="error">{formik.errors.password}</span>}
            </div>

            <div className="form-field">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && <span className="error">{formik.errors.confirmPassword}</span>}
            </div>

            <div className="form-field">
                <label>Role</label>
                <select
                    name="role"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                {formik.touched.role && formik.errors.role && <span className="error">{formik.errors.role}</span>}
            </div>

            <div className="form-field">
                <label>Profile Image</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(event) => {
                        formik.setFieldValue("image", event.currentTarget.files[0]);
                    }}
                />
                {formik.touched.image && formik.errors.image && <span className="error">{formik.errors.image}</span>}
            </div>

            <div className="form-field">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.address && formik.errors.address && <span className="error">{formik.errors.address}</span>}
            </div>

            <button type="submit" disabled={formik.isSubmitting} className="submit-button">
                {formik.isSubmitting ? "Registering..." : "Register"}
            </button>
        </form>
    );
}

export default RegisterForm;
