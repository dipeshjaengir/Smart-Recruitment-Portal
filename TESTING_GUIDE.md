# Smart Recruitment Portal - QA Testing Lab Manual

This manual provides a step-by-step guide to verify the features of the Smart Recruitment Portal. Follow these laboratory steps to test all application flows, verify MongoDB updates, and review API responses.

---

## 🛠️ Testing Environment Details
- **Live Frontend**: `https://smart-recruitment-portal.vercel.app`
- **Live Backend**: `https://smart-recruitment-portal-h8hb.onrender.com`
- **Development Bypass OTP**: `123456`
- **Default Admin Account**: `admin@smartrecruit.com` / `adminpassword`

---

## 🧪 LAB TEST 1: Candidate Signup & Onboarding Flow

### Step 1: Open Registration Page
- **Action**: Navigate to `https://smart-recruitment-portal.vercel.app/register`
- **UI Element**: Click the **Candidate** role selector tab (active by default).
- **Form Inputs**:
  - Name: `Candidate Tester`
  - Email: `candidate.tester@example.com`
  - Password: `password123`
  - Confirm Password: `password123`
- **Action**: Click the **Sign Up** button.
- **Expected Outcome**: UI triggers a loader and redirects to the **Email Verification** modal.
- **Backend API Called**: `POST /api/auth/register`
- **MongoDB Collection Updated**: `users` (status: pending, role: candidate) & `candidates` (stores placeholder details).

### Step 2: Verification Bypass
- **Action**: Enter the 6-digit verification code: `123456` and click **Verify OTP**.
- **Expected Outcome**: Toast alert shows success. The token is saved in `localStorage`, and you are redirected to the **Candidate Dashboard** (`/candidate`).
- **Backend API Called**: `POST /api/auth/verify-otp`
- **MongoDB Collection Updated**: `users` (isVerified: true, verificationOTP: null).

---

## 🧪 LAB TEST 2: Resume Parser & Profile Management

### Step 1: Access Profile Settings
- **Action**: In the sidebar navigation menu, click **My Profile**.
- **Expected Outcome**: Loads candidate details, current resume status (Missing), and an image avatar widget.
- **Backend API Called**: `GET /api/auth/me` (populates page variables).

### Step 2: Upload Resume (AI Parsing Engine)
- **Action**: Drag and drop or select a sample PDF resume file on the dashed upload container.
- **Expected Outcome**: UI displays "Analyzing resume & extracting skills with AI...". Upon success, a toast indicates the CV was parsed successfully, and the parsed fields (Skills, Experience, Education) are automatically merged into the UI.
- **Backend API Called**: `POST /api/profile/resume`
- **MongoDB Collection Updated**: `candidates` (resumeUrl: Cloudinary/local link, parsedResumeData: parsed JSON body, skills: extracted array, experience: extracted array, education: extracted array, profileCompletion: updated score).

### Step 3: Edit Profile Manually
- **Action**: Update the **Bio Description** field to: `Experienced Full Stack Engineer specialized in Node.js and React.` and click **Save Profile Changes**.
- **Expected Outcome**: A success toast is displayed, and the profile completion percentage bar updates dynamically.
- **Backend API Called**: `PUT /api/profile/candidate`
- **MongoDB Collection Updated**: `candidates` (bio: text, updatedAt: timestamp).

---

## 🧪 LAB TEST 3: Recruiter Job Posting Flow

### Step 1: Recruiter Registration
- **Action**: Sign out and navigate to `/register`. Click the **Recruiter** tab.
- **Form Inputs**:
  - Name: `Recruiter Tester`
  - Email: `recruiter.tester@example.com`
  - Password: `password123`
  - Confirm Password: `password123`
- **Action**: Click **Sign Up** and verify using the bypass OTP: `123456`.
- **Expected Outcome**: Redirects to the **Recruiter Dashboard** (`/recruiter`).
- **Backend API Called**: `POST /api/auth/register` and `POST /api/auth/verify-otp`
- **MongoDB Collection Updated**: `users` (role: recruiter) & `recruiters` (stores placeholder company details).

### Step 2: Update Company Details
- **Action**: Navigate to **Company Profile** in the sidebar. Set **Company Name** to `Innovative Tech Ltd` and **Industry** to `Software & IT`. Click **Save Profile Changes**.
- **Expected Outcome**: Company metadata updates.
- **Backend API Called**: `PUT /api/profile/recruiter`
- **MongoDB Collection Updated**: `recruiters` (companyName: "Innovative Tech Ltd", industry: "Software & IT").

### Step 3: Post a New Job opening
- **Action**: Click **Post a Job** in the sidebar.
- **Form Inputs**:
  - Job Title: `MERN Stack Developer`
  - Description: `We are looking for a Node.js and React developer. Experience in MongoDB is required.`
  - Required Skills: `React.js, Node.js, MongoDB, JavaScript`
  - Min Experience: `2`
  - Required Education: `Bachelor of Science`
  - Office Location: `Remote`
  - Work Mode: `Remote`
  - Job Type: `Full Time`
- **Action**: Click the **Post Vacancy** button.
- **Expected Outcome**: Success toast shows, and redirects you to the jobs manager table (`/recruiter/jobs`).
- **Backend API Called**: `POST /api/jobs`
- **MongoDB Collection Updated**: `jobs` (recruiter: id, companyName: "Innovative Tech Ltd", title: "MERN Stack Developer", skillsRequired: ["React.js", "Node.js", "MongoDB", "JavaScript"], experienceRequired: 2).

---

## 🧪 LAB TEST 4: Job Application & Local AI Evaluation

### Step 1: Candidate Job Application
- **Action**: Sign out and log back in as the Candidate (`candidate.tester@example.com` / `password123`). Navigate to **Explore Jobs** in the sidebar.
- **Expected Outcome**: The posted job `MERN Stack Developer` is displayed in the list.
- **Action**: Click on the job card title, review the details, and click **Apply for Position**.
- **Expected Outcome**: An apply modal opens displaying the active resume. Enter cover letter: `Hi, please review my AI match status.` and click **Submit Application**.
- **Expected Outcome**: A success toast is displayed. The screen updates to show a checkmark.
- **Backend API Called**: `POST /api/applications/apply`
- **MongoDB Collection Updated**: `applications` (job: id, candidate: id, aiScore: { overall: 85, skills: 100, experience: 100, education: 100 }, aiRecommendation: "Excellent").

---

## 🧪 LAB TEST 5: Recruiter Review & Interview Scheduling

### Step 1: Review Applicants
- **Action**: Sign out and log in as the Recruiter (`recruiter.tester@example.com` / `password123`). In the sidebar, click **Manage Jobs**.
- **Action**: Locate `MERN Stack Developer` in the table and click the **Applicants** icon (looks like a user profile group).
- **Expected Outcome**: Loads candidate lists sorted automatically by their overall AI suitability score (e.g. 85%). Shows recommendation: `Excellent`.
- **Backend API Called**: `GET /api/applications/job/:jobId`

### Step 2: Schedule Virtual Interview
- **Action**: Click the **Schedule Interview** icon (calendar symbol) beside `Candidate Tester`.
- **Form Inputs**:
  - Interview Date: Choose a future date.
  - Time Slot: `11:00 AM - 11:30 AM`
  - Meeting Platform: `Google Meet`
  - Video Meeting URL: `https://meet.google.com/abc-defg-hij`
- **Action**: Click **Dispatch Calendar Invite**.
- **Expected Outcome**: The application status transitions to "interviewing". An invitation is registered, and a mock email is generated in the console logs.
- **Backend API Called**: `POST /api/interviews`
- **MongoDB Collection Updated**: `interviews` (application: id, date, time, platform, meetingLink, status: scheduled) & `applications` (status: interviewing).

---

## 🧪 LAB TEST 6: Admin System Tuning

### Step 1: Admin Log In
- **Action**: Sign out. Navigate to `/login`.
- **Form Inputs**:
  - Email: `admin@smartrecruit.com`
  - Password: `adminpassword`
- **Action**: Click **Sign In**.
- **Expected Outcome**: Redirects to the **Admin Dashboard** (`/admin`).
- **Backend API Called**: `POST /api/auth/login`

### Step 2: Adjust AI Matching Weights
- **Action**: In the sidebar, click **AI Tuning**.
- **Action**: Tweak slider values:
  - Skills: `40%` (was 35%)
  - Experience: `20%` (was 25%)
  - Education: `20%`
  - Keywords: `10%`
  - Projects: `10%`
- **Expected Outcome**: The sum total equals 100%. Click **Update AI Engine**. Success toast validates the system parameters update.
- **Backend API Called**: `PUT /api/admin/settings/weights`
- **MongoDB Collection Updated**: `settings` (aiWeights: { skills: 40, experience: 20, education: 20, keywords: 10, projectsCertificates: 10 }).
