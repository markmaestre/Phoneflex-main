const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// Registration Route
router.post('/register', upload.single('image'), async (req, res) => {
    const { name, email, password, role, address, confirmPassword } = req.body;
    const imgPath = req.file ? req.file.path : null; // Get uploaded image path
    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ msg: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            address,
            img: imgPath // Save image path to user document
        });

        const savedUser = await newUser.save();

        const verificationToken = jwt.sign(
            { userId: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const url = `http://localhost:5000/api/auth/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify your email',
            html: `Click <a href="${url}">here</a> to verify your email.`
        });

        res.json({ msg: 'Registration successful, please verify your email' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Email Verification Route
router.get('/verify/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(400).json({ msg: 'Invalid link' });

        user.verified = true;
        await user.save();

        res.json({ msg: 'Email verified successfully!' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: 'Invalid or expired token' });
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        if (!user.verified) return res.status(400).json({ msg: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            msg: 'Login successful',
            token,
            user: { name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Protected route example
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password'); // Exclude the password field
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});



// Fetch Users Route (for admin)
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/update-profile', authMiddleware, upload.single('image'), async (req, res) => {
    const { name } = req.body;
    const imgPath = req.file ? req.file.path : null;

    try {
        const user = await User.findById(req.user);
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Update the user's profile data
        user.name = name || user.name;
        if (imgPath) user.img = imgPath;

        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user: { name: user.name, email: user.email, img: user.img },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;


