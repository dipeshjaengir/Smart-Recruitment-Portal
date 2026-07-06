const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Skill = require('../models/Skill');
const Category = require('../models/Category');
const Setting = require('../models/Setting');
const Report = require('../models/Report');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const formattedUsers = await Promise.all(users.map(async (user) => {
      let profile = null;
      if (user.role === 'candidate') {
        profile = await Candidate.findOne({ user: user._id });
      } else if (user.role === 'recruiter') {
        profile = await Recruiter.findOne({ user: user._id });
      }
      return {
        ...user.toObject(),
        profile
      };
    }));

    res.status(200).json({ success: true, count: formattedUsers.length, users: formattedUsers });
  } catch (error) {
    next(error);
  }
};

exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot block admin users' });

    user.status = 'blocked';
    await user.save();

    res.status(200).json({ success: true, message: 'User has been blocked successfully.', user });
  } catch (error) {
    next(error);
  }
};

exports.unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = 'active';
    await user.save();

    res.status(200).json({ success: true, message: 'User has been unblocked successfully.', user });
  } catch (error) {
    next(error);
  }
};

exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    let queryJobs = {};
    let queryApps = {};

    if (req.user.role === 'recruiter') {
      queryJobs = { recruiter: req.user.id };
      const recruiterJobs = await Job.find({ recruiter: req.user.id }).select('_id');
      const recruiterJobIds = recruiterJobs.map(j => j._id);
      queryApps = { job: { $in: recruiterJobIds } };
    }

    const totalCandidates = await User.countDocuments({ role: 'candidate' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments(queryJobs);
    const totalApplications = await Application.countDocuments(queryApps);

    let applicationStatusAggregation;
    let jobCategoryAggregation;

    if (req.user.role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: req.user.id }).select('_id');
      const recruiterJobIds = recruiterJobs.map(j => j._id);
      applicationStatusAggregation = await Application.aggregate([
        { $match: { job: { $in: recruiterJobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      jobCategoryAggregation = await Job.aggregate([
        { $match: { recruiter: new mongoose.Types.ObjectId(req.user.id) } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
    } else {
      applicationStatusAggregation = await Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      jobCategoryAggregation = await Job.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
    }

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalApplications,
        applicationStatuses: applicationStatusAggregation,
        categoriesBreakdown: jobCategoryAggregation,
        aiWeights: settings.aiWeights
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.createPredefinedSkill = async (req, res, next) => {
  const { name } = req.body;
  try {
    const skillExists = await Skill.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (skillExists) {
      return res.status(400).json({ message: 'Skill already registered' });
    }

    const skill = await Skill.create({ name });
    res.status(201).json({ success: true, skill });
  } catch (error) {
    next(error);
  }
};

exports.createPredefinedCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const categoryExists = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already registered' });
    }

    const category = await Category.create({ name });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

exports.updateAIFrictionWeights = async (req, res, next) => {
  const { skills, experience, education, keywords, projectsCertificates } = req.body;
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    settings.aiWeights = {
      skills: skills !== undefined ? skills : settings.aiWeights.skills,
      experience: experience !== undefined ? experience : settings.aiWeights.experience,
      education: education !== undefined ? education : settings.aiWeights.education,
      keywords: keywords !== undefined ? keywords : settings.aiWeights.keywords,
      projectsCertificates: projectsCertificates !== undefined ? projectsCertificates : settings.aiWeights.projectsCertificates
    };

    settings.updatedAt = Date.now();
    await settings.save();

    res.status(200).json({ success: true, message: 'AI scoring weights adjusted successfully.', weights: settings.aiWeights });
  } catch (error) {
    next(error);
  }
};
