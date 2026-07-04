const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Recruiter = require('../models/Recruiter');
const Notification = require('../models/Notification');

exports.createJob = async (req, res, next) => {
  const { title, description, category, skillsRequired, experienceRequired, educationRequired, salaryMin, salaryMax, location, workMode, jobType } = req.body;
  try {
    const recruiterProfile = await Recruiter.findOne({ user: req.user.id });
    if (!recruiterProfile) {
      return res.status(400).json({ message: 'Recruiter profile does not exist. Complete profile first.' });
    }

    const job = await Job.create({
      recruiter: req.user.id,
      companyName: recruiterProfile.companyName || 'My Company',
      title,
      description,
      category,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()),
      experienceRequired,
      educationRequired,
      salaryMin,
      salaryMax,
      location,
      workMode,
      jobType
    });

    await Notification.create({
      user: req.user.id,
      message: `Job position "${title}" posted successfully.`,
      type: 'success',
      link: `/jobs/${job._id}`
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const {
      search,
      category,
      skills,
      experience,
      location,
      workMode,
      jobType,
      salaryMin,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experienceRequired = { $lte: parseInt(experience) };
    }

    if (salaryMin) {
      query.salaryMax = { $gte: parseInt(salaryMin) };
    }

    if (skills) {
      const skillList = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
      query.skillsRequired = { $in: skillList.map(s => new RegExp(s, 'i')) };
    }

    let sortQuery = { createdAt: -1 };
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    } else if (sort === 'salary_desc') {
      sortQuery = { salaryMax: -1 };
    } else if (sort === 'salary_asc') {
      sortQuery = { salaryMin: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job listing' });
    }

    const { skillsRequired } = req.body;
    const updateData = { ...req.body };
    if (skillsRequired) {
      updateData.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim());
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: 'Job details updated successfully.', job });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job listing' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Job listing deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

exports.saveJob = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (candidate.savedJobs.includes(job._id)) {
      return res.status(400).json({ message: 'Job is already bookmarked.' });
    }

    candidate.savedJobs.push(job._id);
    await candidate.save();

    res.status(200).json({ success: true, message: 'Job saved to bookmarks!' });
  } catch (error) {
    next(error);
  }
};

exports.unsaveJob = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({ user: req.user.id });
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate profile not found' });
    }

    candidate.savedJobs = candidate.savedJobs.filter(
      (jobId) => jobId.toString() !== req.params.id
    );
    await candidate.save();

    res.status(200).json({ success: true, message: 'Job removed from bookmarks.' });
  } catch (error) {
    next(error);
  }
};
