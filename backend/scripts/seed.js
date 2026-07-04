require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('../models/Skill');
const Category = require('../models/Category');
const User = require('../models/User');

const categories = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'MERN Stack Developer',
  'Java Developer',
  'Python Developer',
  'React Developer',
  'Node.js Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cyber Security Analyst',
  'UI/UX Designer',
  'Mobile App Developer',
  'QA/Test Engineer',
  'Business Analyst',
  'Product Manager'
];

const skills = [
  'Java', 'C++', 'Python', 'JavaScript', 'TypeScript', 'React.js', 'Next.js', 
  'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'HTML', 'CSS', 
  'Tailwind CSS', 'Bootstrap', 'Redux', 'Git', 'GitHub', 'Docker', 'Kubernetes', 
  'AWS', 'Azure', 'GCP', 'REST API', 'GraphQL', 'Linux', 'Firebase', 'Socket.IO', 
  'JWT', 'OAuth', 'CI/CD', 'Jenkins', 'Terraform', 'Machine Learning', 
  'TensorFlow', 'PyTorch', 'Data Structures & Algorithms', 'OOP', 'DBMS', 
  'Operating Systems', 'Computer Networks'
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_recruitment_portal';
    await mongoose.connect(mongoUri);
    console.log('Seed: Connected to MongoDB.');

    await Category.deleteMany();
    const categoryDoc = categories.map(cat => ({ name: cat }));
    await Category.insertMany(categoryDoc);
    console.log(`Seed: Added ${categories.length} job categories.`);

    await Skill.deleteMany();
    const skillDoc = skills.map(skill => ({ name: skill }));
    await Skill.insertMany(skillDoc);
    console.log(`Seed: Added ${skills.length} technical skills.`);

    const adminEmail = 'admin@smartrecruit.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        email: adminEmail,
        password: 'adminpassword',
        role: 'admin',
        isVerified: true
      });
      console.log(`Seed: Admin user created (${adminEmail} / adminpassword).`);
    } else {
      console.log('Seed: Admin user already registered.');
    }

    console.log('Database Seeding finished successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('Database Seeding failure:', error);
    process.exit(1);
  }
};

seedDatabase();
