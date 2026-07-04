const path = require('path');
const fs = require('fs');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { parseResumePDF } = require('../services/parserService');
const { isCloudinaryConfigured, cloudinary } = require('../config/cloudinary');

const getFileUrl = (file, subfolder) => {
  const isCloudinary = isCloudinaryConfigured;
  if (isCloudinary) {
    return null;
  }
  return `/uploads/${subfolder}/${file.filename}`;
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profile = null;
    if (user.role === 'candidate') {
      profile = await Candidate.findOne({ user: user._id }).populate('savedJobs');
    } else if (user.role === 'recruiter') {
      profile = await Recruiter.findOne({ user: user._id });
    }

    res.status(200).json({ success: true, user, profile });
  } catch (error) {
    next(error);
  }
};

exports.updateCandidateProfile = async (req, res, next) => {
  try {
    let candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    const { name, phone, title, bio, skills, education, experience, projects, certificates } = req.body;

    if (name) candidate.name = name;
    if (phone !== undefined) candidate.phone = phone;
    if (title !== undefined) candidate.title = title;
    if (bio !== undefined) candidate.bio = bio;
    if (skills) candidate.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (education) candidate.education = education;
    if (experience) candidate.experience = experience;
    if (projects) candidate.projects = projects;
    if (certificates) candidate.certificates = certificates;

    await candidate.save();

    await Notification.create({
      user: req.user.id,
      message: 'Your candidate profile was successfully updated.',
      type: 'success',
      link: '/profile'
    });

    res.status(200).json({ success: true, message: 'Profile updated successfully!', profile: candidate });
  } catch (error) {
    next(error);
  }
};

exports.updateRecruiterProfile = async (req, res, next) => {
  try {
    let recruiter = await Recruiter.findOne({ user: req.user.id });
    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter profile not found' });
    }

    const { name, phone, companyName, companyWebsite, industry, about, designation } = req.body;

    if (name) recruiter.name = name;
    if (phone !== undefined) recruiter.phone = phone;
    if (companyName !== undefined) recruiter.companyName = companyName;
    if (companyWebsite !== undefined) recruiter.companyWebsite = companyWebsite;
    if (industry !== undefined) recruiter.industry = industry;
    if (about !== undefined) recruiter.about = about;
    if (designation !== undefined) recruiter.designation = designation;

    await recruiter.save();

    await Notification.create({
      user: req.user.id,
      message: 'Your recruiter company profile was successfully updated.',
      type: 'success',
      link: '/profile'
    });

    res.status(200).json({ success: true, message: 'Recruiter profile updated successfully!', profile: recruiter });
  } catch (error) {
    next(error);
  }
};

exports.uploadResume = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume file' });
  }

  const filePath = req.file.path;

  try {
    let candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    const parsedData = await parseResumePDF(filePath);

    let uploadedUrl = '';
    if (isCloudinaryConfigured) {
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'resumes',
          resource_type: 'raw'
        });
        uploadedUrl = uploadResult.secure_url;
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Cloudinary upload failure, using local backup url:', err);
        uploadedUrl = getFileUrl(req.file, 'resumes');
      }
    } else {
      uploadedUrl = getFileUrl(req.file, 'resumes');
    }

    candidate.resumeUrl = uploadedUrl;
    candidate.parsedResumeData = parsedData;
    
    if (parsedData.name && candidate.name === 'Candidate Name') candidate.name = parsedData.name;
    if (parsedData.phone && !candidate.phone) candidate.phone = parsedData.phone;
    
    if (parsedData.skills && parsedData.skills.length > 0) {
      const uniqueSkills = new Set([...candidate.skills, ...parsedData.skills]);
      candidate.skills = Array.from(uniqueSkills);
    }

    if (parsedData.education && parsedData.education.length > 0 && candidate.education.length === 0) {
      candidate.education = parsedData.education;
    }

    if (parsedData.experience && parsedData.experience.length > 0 && candidate.experience.length === 0) {
      candidate.experience = parsedData.experience;
    }

    if (parsedData.projects && parsedData.projects.length > 0 && candidate.projects.length === 0) {
      candidate.projects = parsedData.projects;
    }

    if (parsedData.certificates && parsedData.certificates.length > 0 && candidate.certificates.length === 0) {
      candidate.certificates = parsedData.certificates;
    }

    await candidate.save();

    await Notification.create({
      user: req.user.id,
      message: 'Resume uploaded and parsed successfully! Review candidate dashboard scores.',
      type: 'success',
      link: '/profile'
    });

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and AI parsed successfully!',
      resumeUrl: uploadedUrl,
      parsedData,
      profile: candidate
    });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image file' });
  }

  const filePath = req.file.path;

  try {
    const user = await User.findById(req.user.id);
    let profileImageUrl = '';

    if (isCloudinaryConfigured) {
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'profiles'
        });
        profileImageUrl = uploadResult.secure_url;
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Cloudinary image upload failure, using local backup:', err);
        profileImageUrl = getFileUrl(req.file, 'profiles');
      }
    } else {
      profileImageUrl = getFileUrl(req.file, 'profiles');
    }

    if (user.role === 'candidate') {
      let candidate = await Candidate.findOne({ user: user._id });
      candidate.profileImageUrl = profileImageUrl;
      await candidate.save();
      return res.status(200).json({ success: true, imageUrl: profileImageUrl, profile: candidate });
    } else if (user.role === 'recruiter') {
      let recruiter = await Recruiter.findOne({ user: user._id });
      recruiter.companyLogo = profileImageUrl;
      await recruiter.save();
      return res.status(200).json({ success: true, imageUrl: profileImageUrl, profile: recruiter });
    }

    res.status(400).json({ message: 'Invalid user role for profile image update' });
  } catch (error) {
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (e) {}
    }
    next(error);
  }
};
