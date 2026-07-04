const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');

exports.scheduleInterview = async (req, res, next) => {
  const { applicationId, date, time, platform, meetingLink, notes } = req.body;
  try {
    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to schedule interviews for this applicant' });
    }

    const candidateProfile = await Candidate.findOne({ user: application.candidate });
    const candidateUser = await User.findById(application.candidate);

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate,
      recruiter: req.user.id,
      job: application.job._id,
      date,
      time,
      platform,
      meetingLink,
      notes: notes || ''
    });

    application.status = 'interviewing';
    application.logs.push({
      status: 'interviewing',
      updatedBy: req.user.id,
      comment: `Interview scheduled on ${date} at ${time} via ${platform}`
    });
    await application.save();

    const alertMessage = `Interview scheduled for "${application.job.title}" on ${date} at ${time}.`;
    await Notification.create({
      user: application.candidate,
      message: `${alertMessage} Platform: ${platform}`,
      type: 'warning',
      link: '/candidate/interviews'
    });

    const emailSubject = `Interview Scheduled: ${application.job.title}`;
    const emailHtml = `
      <h3>Interview Invitation</h3>
      <p>Dear ${candidateProfile ? candidateProfile.name : 'Candidate'},</p>
      <p>We are pleased to invite you for an interview with <strong>${application.job.companyName}</strong> for the position of <strong>${application.job.title}</strong>.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 5px 0;"><strong>Platform:</strong> ${platform}</p>
        <p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>
      </div>
      ${notes ? `<p><strong>Recruiter Notes:</strong> ${notes}</p>` : ''}
      <p>Please log in early and verify your webcam/audio connections.</p>
      <p>Best of luck!</p>
    `;

    await sendEmail({
      to: candidateUser.email,
      subject: emailSubject,
      text: alertMessage,
      html: emailHtml
    });

    res.status(201).json({ success: true, message: 'Interview scheduled and candidate notified.', interview });
  } catch (error) {
    next(error);
  }
};

exports.getCandidateInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ candidate: req.user.id })
      .populate('job recruiter')
      .sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    next(error);
  }
};

exports.getRecruiterInterviews = async (req, res, next) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user.id })
      .populate('job candidate')
      .sort({ date: 1, time: 1 });

    const formattedInterviews = await Promise.all(interviews.map(async (interview) => {
      const candidateProfile = await Candidate.findOne({ user: interview.candidate._id }).lean();
      return {
        ...interview.toObject(),
        candidateProfile
      };
    }));

    res.status(200).json({ success: true, count: formattedInterviews.length, interviews: formattedInterviews });
  } catch (error) {
    next(error);
  }
};

exports.updateInterviewStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const interview = await Interview.findById(req.params.id).populate('job');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to modify this interview' });
    }

    interview.status = status;
    await interview.save();

    const candidateUser = await User.findById(interview.candidate);
    const alertMessage = `Your interview status for "${interview.job.title}" has been updated to "${status.toUpperCase()}".`;
    await Notification.create({
      user: interview.candidate,
      message: alertMessage,
      type: status === 'cancelled' ? 'danger' : 'success',
      link: '/candidate/interviews'
    });

    res.status(200).json({ success: true, message: `Interview status marked as ${status}.`, interview });
  } catch (error) {
    next(error);
  }
};
