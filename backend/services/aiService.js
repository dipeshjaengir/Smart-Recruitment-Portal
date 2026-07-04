const Setting = require('../models/Setting');

const evaluateCandidate = async (candidateProfile, jobDetails) => {
  try {
    let weights = {
      skills: 35,
      experience: 25,
      education: 20,
      keywords: 10,
      projectsCertificates: 10
    };

    try {
      const dbSettings = await Setting.findOne().lean();
      if (dbSettings && dbSettings.aiWeights) {
        weights = dbSettings.aiWeights;
      }
    } catch (e) {
      console.warn('Could not load AI settings, using system defaults.');
    }

    const requiredSkills = jobDetails.skillsRequired || [];
    const candidateSkills = candidateProfile.skills || [];
    let skillsScore = 100;

    if (requiredSkills.length > 0) {
      const matches = requiredSkills.filter(reqSkill =>
        candidateSkills.some(candSkill => candSkill.toLowerCase().includes(reqSkill.toLowerCase()))
      );
      skillsScore = Math.round((matches.length / requiredSkills.length) * 100);
    }

    const requiredExpYears = jobDetails.experienceRequired || 0;
    const candidateExpYears = candidateProfile.yearsOfExperience || 0;
    let experienceScore = 100;

    if (requiredExpYears > 0) {
      if (candidateExpYears >= requiredExpYears) {
        experienceScore = 100;
      } else {
        experienceScore = Math.round((candidateExpYears / requiredExpYears) * 100);
      }
    }

    const requiredEducation = (jobDetails.educationRequired || '').toLowerCase();
    const candidateEducation = candidateProfile.education || [];
    let educationScore = 50;

    if (!requiredEducation || requiredEducation.includes('any')) {
      educationScore = 100;
    } else {
      const hasDirectDegree = candidateEducation.some(edu => {
        const degree = (edu.degree || '').toLowerCase();
        const field = (edu.fieldOfStudy || '').toLowerCase();
        return degree.includes(requiredEducation) || requiredEducation.includes(degree) || field.includes(requiredEducation);
      });

      if (hasDirectDegree) {
        educationScore = 100;
      } else {
        const hasAnyDegree = candidateEducation.length > 0;
        educationScore = hasAnyDegree ? 70 : 0;
      }
    }

    const jdWords = (jobDetails.description + ' ' + jobDetails.title)
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);
    
    const stopWords = new Set(['this', 'that', 'with', 'from', 'have', 'your', 'about', 'will', 'their', 'should', 'would', 'could']);
    const filteredJdWords = [...new Set(jdWords.filter(w => !stopWords.has(w)))];

    const resumeText = (candidateProfile.rawText || '').toLowerCase();
    let keywordMatches = 0;
    if (filteredJdWords.length > 0) {
      filteredJdWords.forEach(word => {
        if (resumeText.includes(word)) {
          keywordMatches++;
        }
      });
      keywordMatches = Math.round((keywordMatches / filteredJdWords.length) * 100);
    } else {
      keywordMatches = 100;
    }
    const keywordsScore = keywordMatches;

    let projCertScore = 0;
    const hasProjects = (candidateProfile.projects && candidateProfile.projects.length > 0);
    const hasCertificates = (candidateProfile.certificates && candidateProfile.certificates.length > 0);

    if (hasProjects) projCertScore += 50;
    if (hasCertificates) projCertScore += 50;
    const projectsCertificatesScore = projCertScore;

    const overallScore = Math.round(
      (skillsScore * (weights.skills / 100)) +
      (experienceScore * (weights.experience / 100)) +
      (educationScore * (weights.education / 100)) +
      (keywordsScore * (weights.keywords / 100)) +
      (projectsCertificatesScore * (weights.projectsCertificates / 100))
    );

    let aiRecommendation = 'Reject';
    if (overallScore >= 85) {
      aiRecommendation = 'Excellent';
    } else if (overallScore >= 70) {
      aiRecommendation = 'Very Good';
    } else if (overallScore >= 55) {
      aiRecommendation = 'Good';
    } else if (overallScore >= 40) {
      aiRecommendation = 'Average';
    }

    return {
      overall: Math.min(100, Math.max(0, overallScore)),
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      keywords: keywordsScore,
      projectsCertificates: projectsCertificatesScore,
      recommendation: aiRecommendation
    };
  } catch (error) {
    console.error('Error executing candidate evaluation engine:', error);
    throw error;
  }
};

module.exports = { evaluateCandidate };
