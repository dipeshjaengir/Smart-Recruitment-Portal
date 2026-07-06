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
    let totalCount = await Job.countDocuments();
    if (totalCount === 0) {
      const User = require('../models/User');
      let recruiterUser = await User.findOne({ role: 'recruiter' });
      if (!recruiterUser) {
        recruiterUser = await User.findOne({ role: 'admin' });
      }
      if (!recruiterUser) {
        recruiterUser = await User.create({
          email: 'recruiter.demo@smartrecruit.com',
          password: 'password123',
          role: 'recruiter',
          isVerified: true
        });
        const Recruiter = require('../models/Recruiter');
        await Recruiter.create({
          user: recruiterUser._id,
          name: 'Demo Hiring Manager',
          companyName: 'Innovative Tech Corp'
        });
      }

      const demoJobs = [
        {
          recruiter: recruiterUser._id,
          companyName: 'Google',
          title: 'Senior Frontend Engineer',
          description: 'Join the Google Search frontend team. Develop responsive interfaces using React, Next.js, and TypeScript. Scale global platforms.',
          category: 'Frontend Developer',
          skillsRequired: ['React.js', 'Next.js', 'TypeScript', 'HTML', 'CSS', 'JavaScript'],
          experienceRequired: 5,
          educationRequired: 'Bachelor of Science',
          salaryMin: 120000,
          salaryMax: 180000,
          location: 'Mountain View, CA',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Microsoft',
          title: 'Software Developer II (Backend)',
          description: 'Design and optimize core cloud features in Azure. Build microservices using Java, C++, and PostgreSQL. Develop secure APIs.',
          category: 'Backend Developer',
          skillsRequired: ['Java', 'C++', 'PostgreSQL', 'Docker', 'Kubernetes', 'REST API'],
          experienceRequired: 3,
          educationRequired: 'Bachelor of Science',
          salaryMin: 110000,
          salaryMax: 160000,
          location: 'Redmond, WA',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Amazon',
          title: 'DevOps / Cloud Specialist',
          description: 'Manage production services in AWS. Automate CI/CD pipelines using Terraform, Jenkins, and Kubernetes. Optimize cloud security.',
          category: 'DevOps Engineer',
          skillsRequired: ['AWS', 'Terraform', 'CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Linux'],
          experienceRequired: 4,
          educationRequired: 'Bachelor of Science',
          salaryMin: 130000,
          salaryMax: 175000,
          location: 'Seattle, WA',
          workMode: 'remote',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Meta',
          title: 'Full Stack MERN Developer',
          description: 'Build features for Instagram Web. Work across React, Node.js, Express, and MongoDB. Secure OAuth authentication layers.',
          category: 'MERN Stack Developer',
          skillsRequired: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'JWT', 'OAuth'],
          experienceRequired: 3,
          educationRequired: 'Bachelor of Science',
          salaryMin: 140000,
          salaryMax: 190000,
          location: 'Menlo Park, CA',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Adobe',
          title: 'Java Platform Developer',
          description: 'Work on Photoshop cloud integrations. Implement microservices, write clean OOP, and maintain high performance MySQL clusters.',
          category: 'Java Developer',
          skillsRequired: ['Java', 'MySQL', 'OOP', 'REST API', 'Git'],
          experienceRequired: 3,
          educationRequired: 'Bachelor of Science',
          salaryMin: 105000,
          salaryMax: 150000,
          location: 'San Jose, CA',
          workMode: 'onsite',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Netflix',
          title: 'Data Scientist (Machine Learning)',
          description: 'Optimize recommendation algorithms. Train models in Python using TensorFlow, PyTorch, and large dataset packages.',
          category: 'Data Scientist',
          skillsRequired: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Structures & Algorithms'],
          experienceRequired: 5,
          educationRequired: 'Master of Science',
          salaryMin: 150000,
          salaryMax: 220000,
          location: 'Los Gatos, CA',
          workMode: 'remote',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'TCS',
          title: 'Full Stack Developer',
          description: 'Collaborate with enterprise banking clients. Support legacy and modern tech stacks (Java, React, SQL databases).',
          category: 'Full Stack Developer',
          skillsRequired: ['React.js', 'Java', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
          experienceRequired: 2,
          educationRequired: 'Bachelor of Science',
          salaryMin: 65000,
          salaryMax: 90000,
          location: 'Dallas, TX',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Infosys',
          title: 'React UI Specialist',
          description: 'Design interactive, accessible portals. Maintain state with Redux. Optimize code structures for fast rendering.',
          category: 'React Developer',
          skillsRequired: ['React.js', 'Redux', 'Bootstrap', 'Git', 'HTML', 'CSS'],
          experienceRequired: 2,
          educationRequired: 'Bachelor of Science',
          salaryMin: 70000,
          salaryMax: 95000,
          location: 'Chicago, IL',
          workMode: 'onsite',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Wipro',
          title: 'Junior Cloud Developer',
          description: 'Deploy web apps to Azure and GCP. Write serverless scripts. Troubleshoot networking configurations.',
          category: 'Cloud Engineer',
          skillsRequired: ['Azure', 'GCP', 'REST API', 'Linux', 'Git'],
          experienceRequired: 1,
          educationRequired: 'Bachelor of Science',
          salaryMin: 60000,
          salaryMax: 85000,
          location: 'Boston, MA',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Oracle',
          title: 'Database & DBMS Engineer',
          description: 'Support cloud datastores. Design indexing, SQL queries optimization, and maintain data replication streams.',
          category: 'Backend Developer',
          skillsRequired: ['SQL', 'DBMS', 'OOP', 'PostgreSQL', 'Linux'],
          experienceRequired: 4,
          educationRequired: 'Bachelor of Science',
          salaryMin: 115000,
          salaryMax: 165000,
          location: 'Austin, TX',
          workMode: 'onsite',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Accenture',
          title: 'Security Analyst',
          description: 'Perform system penetration testing. Audit software systems, firewall rule lists, and secure OAuth endpoints.',
          category: 'Cyber Security Analyst',
          skillsRequired: ['Linux', 'OAuth', 'JWT', 'Computer Networks'],
          experienceRequired: 3,
          educationRequired: 'Bachelor of Science',
          salaryMin: 90000,
          salaryMax: 135000,
          location: 'Atlanta, GA',
          workMode: 'remote',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Adobe',
          title: 'UI/UX Interactive Designer',
          description: 'Create premium system graphics. Design wireframes, user personas, and map visual workflows.',
          category: 'UI/UX Designer',
          skillsRequired: ['UI/UX', 'HTML', 'CSS', 'Tailwind CSS', 'Figma'],
          experienceRequired: 2,
          educationRequired: 'Bachelor of Fine Arts',
          salaryMin: 80000,
          salaryMax: 120000,
          location: 'New York, NY',
          workMode: 'remote',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'IBM',
          title: 'Python Software Engineer',
          description: 'Write script pipelines, analyze metrics, and support AI backend architectures.',
          category: 'Python Developer',
          skillsRequired: ['Python', 'Data Structures & Algorithms', 'Linux', 'REST API'],
          experienceRequired: 2,
          educationRequired: 'Bachelor of Science',
          salaryMin: 95000,
          salaryMax: 140000,
          location: 'San Jose, CA',
          workMode: 'onsite',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Meta',
          title: 'Mobile React Native Developer',
          description: 'Deploy hybrid candidates to Android and iOS App Stores. Maintain fast local storage integrations.',
          category: 'Mobile App Developer',
          skillsRequired: ['React.js', 'Android', 'iOS', 'Git', 'REST API'],
          experienceRequired: 3,
          educationRequired: 'Bachelor of Science',
          salaryMin: 125000,
          salaryMax: 170000,
          location: 'Seattle, WA',
          workMode: 'hybrid',
          jobType: 'full-time'
        },
        {
          recruiter: recruiterUser._id,
          companyName: 'Google',
          title: 'QA / Automation Test Engineer',
          description: 'Write unit tests, automated integration flows, and run visual browser automation checkups.',
          category: 'QA/Test Engineer',
          skillsRequired: ['JavaScript', 'Git', 'CI/CD', 'Linux'],
          experienceRequired: 2,
          educationRequired: 'Bachelor of Science',
          salaryMin: 90000,
          salaryMax: 130000,
          location: 'Chicago, IL',
          workMode: 'hybrid',
          jobType: 'full-time'
        }
      ];

      const inrJobs = demoJobs.map(job => ({
        ...job,
        salaryMin: job.salaryMin * 10,
        salaryMax: job.salaryMax * 10
      }));

      await Job.insertMany(inrJobs);
    }

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
