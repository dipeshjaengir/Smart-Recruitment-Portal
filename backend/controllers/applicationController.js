const Application = require('../models/Application');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { evaluateCandidate } = require('../services/aiService');
const { sendEmail } = require('../services/emailService');

exports.applyJob = async (req, res, next) => {
  const { jobId, coverLetter } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job vacancy not found' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ message: 'This job vacancy has been closed' });
    }

    const candidateProfile = await Candidate.findOne({ user: req.user.id });
    if (!candidateProfile || !candidateProfile.resumeUrl) {
      return res.status(400).json({ message: 'Please upload your resume in the Profile page before applying.' });
    }

    const alreadyApplied = await Application.findOne({ job: jobId, candidate: req.user.id });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job listing.' });
    }

    const aiEvaluation = await evaluateCandidate(candidateProfile, job);

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resumeUrl: candidateProfile.resumeUrl,
      coverLetter: coverLetter || '',
      aiScore: {
        overall: aiEvaluation.overall,
        skills: aiEvaluation.skills,
        experience: aiEvaluation.experience,
        education: aiEvaluation.education,
        keywords: aiEvaluation.keywords
      },
      aiRecommendation: aiEvaluation.recommendation,
      logs: [{
        status: 'applied',
        updatedBy: req.user.id,
        comment: 'Application submitted online.'
      }]
    });

    await Notification.create({
      user: job.recruiter,
      message: `New applicant "${candidateProfile.name}" applied for "${job.title}". AI Suitability Score: ${aiEvaluation.overall}%`,
      type: 'info',
      link: `/recruiter/jobs/${jobId}/applications`
    });

    await Notification.create({
      user: req.user.id,
      message: `You successfully applied for "${job.title}". AI Score: ${aiEvaluation.overall}%`,
      type: 'success',
      link: '/candidate/applications'
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! AI analysis complete.',
      application
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applicants for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'candidate',
        select: 'email',
        populate: { path: 'user', select: 'email' }
      })
      .sort({ 'aiScore.overall': -1 });

    const formattedApps = await Promise.all(applications.map(async (app) => {
      const candidateProfile = await Candidate.findOne({ user: app.candidate._id }).lean();
      return {
        ...app.toObject(),
        candidateProfile
      };
    }));

    res.status(200).json({ success: true, count: formattedApps.length, applications: formattedApps });
  } catch (error) {
    next(error);
  }
};

exports.getCandidateApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job')
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  const { status, comment } = req.body;
  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to change application status' });
    }

    application.status = status;
    application.logs.push({
      status,
      updatedBy: req.user.id,
      comment: comment || `Status modified to ${status}`
    });
    await application.save();

    const candidateProfile = await Candidate.findOne({ user: application.candidate });
    const candidateUser = await User.findById(application.candidate);

    const alertMessage = `Your application status for "${application.job.title}" has been updated to "${status.toUpperCase()}".`;
    await Notification.create({
      user: application.candidate,
      message: alertMessage,
      type: status === 'rejected' ? 'danger' : status === 'accepted' ? 'success' : 'info',
      link: '/candidate/applications'
    });

    const emailSubject = `Job Application Update: ${application.job.title}`;
    const emailHtml = `
      <h3>Application Update</h3>
      <p>Dear ${candidateProfile ? candidateProfile.name : 'Candidate'},</p>
      <p>The hiring team at <strong>${application.job.companyName}</strong> has updated your application status for the position of <strong>${application.job.title}</strong>.</p>
      <p>New Status: <span style="font-weight: bold; color: #4f46e5; text-transform: uppercase;">${status}</span></p>
      ${comment ? `<p>Feedback: <em>"${comment}"</em></p>` : ''}
      <p>Log in to the recruitment portal to track further updates.</p>
      <br/>
      <p>Best Regards,</p>
      <p>Hiring Team</p>
    `;

    await sendEmail({
      to: candidateUser.email,
      subject: emailSubject,
      text: alertMessage,
      html: emailHtml
    });

    res.status(200).json({ success: true, message: 'Status updated successfully.', application });
  } catch (error) {
    next(error);
  }
};

exports.exportApplicationsCSV = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId });
    const formattedApps = await Promise.all(applications.map(async (app) => {
      const candidateProfile = await Candidate.findOne({ user: app.candidate }).lean();
      const candidateUser = await User.findById(app.candidate).lean();
      return {
        name: candidateProfile ? candidateProfile.name : 'N/A',
        email: candidateUser ? candidateUser.email : 'N/A',
        phone: candidateProfile ? candidateProfile.phone : 'N/A',
        overallScore: app.aiScore.overall,
        skillsScore: app.aiScore.skills,
        experienceScore: app.aiScore.experience,
        recommendation: app.aiRecommendation,
        status: app.status,
        appliedAt: app.appliedAt.toISOString().split('T')[0]
      };
    }));

    let csvContent = 'Candidate Name,Email,Phone,Overall Suitability Score (%),Skills Match Score (%),Experience Score (%),Recommendation,Application Status,Applied Date\n';
    formattedApps.forEach(app => {
      csvContent += `"${app.name}","${app.email}","${app.phone}",${app.overallScore},${app.skillsScore},${app.experienceScore},"${app.recommendation}","${app.status}","${app.appliedAt}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`applicants-${req.params.jobId}.csv`);
    return res.send(csvContent);
  } catch (error) {
    next(error);
  }
};
