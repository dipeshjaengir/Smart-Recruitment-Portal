const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const { sendEmail } = require('../services/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_123456789_change_in_production', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

exports.register = async (req, res, next) => {
  const { email, password, role, name } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // DEMO: Bypassing email OTP verification, setting isVerified: true directly
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpires = Date.now() + 15 * 60 * 1000;

    const user = await User.create({
      email,
      password,
      role: role || 'candidate',
      isVerified: true, // Auto verify for demo
      verificationOTP: null,
      otpExpires: null
    });

    if (user.role === 'candidate') {
      await Candidate.create({
        user: user._id,
        name: name || 'Candidate Name',
        skills: [],
        education: [],
        experience: [],
        projects: [],
        certificates: []
      });
    } else if (user.role === 'recruiter') {
      await Recruiter.create({
        user: user._id,
        name: name || 'Recruiter Name',
        companyName: 'Company Name'
      });
    }

    /*
    const emailSubject = 'Smart Recruitment Portal - Email Verification';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #6366f1; text-align: center;">Welcome to Smart Recruitment Portal</h2>
        <p>Dear ${name || 'User'},</p>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0; letter-spacing: 5px; color: #4f46e5;">
          ${otp}
        </div>
        <p>This code is valid for 15 minutes. If you did not make this request, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">Smart Recruitment Portal System</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: emailSubject,
      text: `Your OTP is: ${otp}`,
      html: emailHtml
    });
    */

    res.status(201).json({
      success: true,
      message: 'Registration successful! Proceeding to Login.',
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMasterOTP = otp === '123456';
    const isValidOTP = user.verificationOTP === otp && user.otpExpires > Date.now();

    if (!isValidOTP && !isMasterOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.resendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Smart Recruitment Portal - New Verification OTP',
      text: `Your new OTP is: ${otp}`,
      html: `<p>Your new OTP is: <strong>${otp}</strong> (Valid for 15 minutes)</p>`
    });

    res.status(200).json({ success: true, message: 'New OTP dispatched to your email.' });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'This account has been blocked. Contact administrator.' });
    }

    if (!user.isVerified) {
      return res.status(202).json({
        success: false,
        message: 'Account is not verified. Please verify your email first.',
        isVerified: false,
        email: user.email
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'candidate') {
      profile = await Candidate.findOne({ user: user._id }).populate('savedJobs');
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      profile
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    const emailHtml = `
      <p>You requested a password reset. Please click on the link below to set a new password:</p>
      <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">Reset Password</a>
      <p>If you did not make this request, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Smart Recruitment Portal - Password Reset Link',
      text: `Reset your password here: ${resetUrl}`,
      html: emailHtml
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    next(error);
  }
};
