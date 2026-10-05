# AI-Powered Course Recommendation System
### Full-Stack AI/ML Personalized Learning Platform | Portfolio & Placement Ready
**MERN Stack (MongoDB, Express.js, React, Node.js) + Python (Scikit-Learn, TF-IDF, NLP)**

---

## 🚀 1. Project Overview

The **AI-Powered Course Recommendation System** is an intelligent learning platform engineered to help students discover and master online courses tailored to their personal skills, interests, career ambitions, and historical learning progress.

Rather than relying on basic keyword searches or popularity alone, the platform implements a **Hybrid AI Recommendation Engine** combining Natural Language Processing (TF-IDF vectorization and cosine similarity), skill coverage mapping, difficulty suitability matrices, format preferences, and continuous learner feedback.

### Key Working Capabilities
- 🔐 **Authentication & Profile Management**: JWT-authenticated student and administrator roles, password hashing with bcrypt, and profile configuration (skills with 0–100% proficiencies, education level, duration and format preferences).
- 🧠 **Hybrid AI Recommendation Engine**: Python microservice computing multi-factor relevance scores with dynamic natural language explanations for every course recommendation.
- 🎯 **Career Skill-Gap Analysis**: Benchmarks student competencies against 6 industry job roles (Data Analyst, Full Stack Developer, Machine Learning Engineer, Cloud DevOps, Cybersecurity, UI/UX Designer) to identify missing and partially developed skills.
- 🗺️ **Personalized Learning Roadmaps**: Automatically sequences courses into a 4-stage pedagogical curriculum (Foundations, Applied Tools, Advanced Topics, Capstone Project) with prerequisite tracking and progress checkmarks.
- 🤖 **Grounded AI Learning Mentor**: Interactive chatbot assistant grounded in the course catalog and student profile, providing personalized study plans, prerequisite explanations, and course recommendations without hallucinations.
- 📊 **Learning Analytics & Progress Dashboard**: Tracks completed modules, study hours, weekly activity charts (Recharts), and skill mastery breakdowns.
- 🛡️ **Administrative Management Portal**: Role-based course CRUD, CSV bulk dataset import, user directory, and live offline ML evaluation benchmark comparison.

---

## 🏗️ 2. System Architecture

```
+--------------------------------------------------------------------------+
|                                CLIENT                                    |
|         React 18 + Vite + Tailwind CSS + Lucide Icons + Recharts         |
|  - Student Dashboard      - Course Catalog & Filters  - Skill Gap Analyzer|
|  - Career Roadmap Graph   - Learning Progress Tracker  - AI Chat Mentor   |
|  - Admin CRUD & Metrics   - Score Breakdown Modal     - 1-Click Demo     |
+------------------------------------+-------------------------------------+
                                     |  HTTP REST / Axios (Port 3000 -> 5000)
                                     v
+--------------------------------------------------------------------------+
|                             NODE.JS BACKEND                              |
|                          Express.js REST APIs                            |
|  - Auth Routes (JWT/bcrypt)    - Course Routes & CSV Ingestion           |
|  - Recommendation Router       - Skill-Gap & Roadmap Business Logic      |
|  - Assistant Grounded Engine   - Analytics & Enrollment Management       |
+-------------------+--------------------------------+---------------------+
                    |                                |
                    v                                v
+---------------------------------------+  +-------------------------------+
|               DATABASE                |  |       PYTHON ML SERVICE       |
| MongoDB / Resilient JSON Store Layer  |  |    Flask Microservice (5001)  |
|  - Users Collection                   |  |  - TfidfVectorizer (NLP)      |
|  - Courses Collection (30+ Courses)   |  |  - Cosine Similarity Metric   |
|  - Enrollments & Progress Collection  |  |  - Hybrid Scoring Algorithm   |
|  - Feedback Interactions Collection   |  |  - Skill Gap Calculator       |
|  - Careers Benchmark Collection       |  |  - Roadmap Phased Sequencer   |
|  - ChatHistory Collection             |  |  - Offline Evaluation Bench   |
+---------------------------------------+  +-------------------------------+
```

---

## 🧮 3. Recommendation Engine Architecture & Scoring Formula

The core machine learning engine uses content-based filtering with **TF-IDF vectorization** and a multi-factor **Hybrid Scoring Formula**:

$$S = 0.40T + 0.30K + 0.15D + 0.10P + 0.05F$$

Where all sub-scores are strictly normalized in the range $[0.0, 1.0]$:

| Term | Weight | Component | Mathematical Definition & Logic |
| :---: | :---: | :--- | :--- |
| **$T$** | **0.40** | **Textual Content Similarity** | Cosine similarity between TF-IDF unigram/bigram representation of user profile (career goals, interests) and course text (title, description, skills, category). |
| **$K$** | **0.30** | **Skill Gap & Coverage Match** | Weighted overlap between course skills and the student's target career missing skills and current proficiencies: $\frac{0.45|\text{retained}| + 0.55|\text{bridged}|}{\max(1, |\text{course skills}|)}$. |
| **$D$** | **0.15** | **Difficulty Appropriateness** | Compatibility matrix between student experience (`Beginner`, `Intermediate`, `Advanced`) and course difficulty (`Beginner`, `Intermediate`, `Advanced`, `All Levels`). |
| **$P$** | **0.10** | **Preference Match** | Concordance with preferred study pace (short: $\le 15$h, medium: $15-40$h, long: $\ge 40$h) and format (video, interactive, project, reading). |
| **$F$** | **0.05** | **Feedback Reinforcement** | Score adjustment based on past user interactions: likes (+0.4), bookmarks (+0.25), completions (+0.3), dislikes (-0.4), dismissals (-0.35). |

### Explainable AI (XAI)
Every recommendation returned to the user contains a transparent natural language explanation. For example:
> *"Directly bridges critical skill gaps in 'SQL', 'PostgreSQL' required for your Data Analyst career goal. Tailored difficulty match for a Beginner learner."*

Students can also click **"Score Math"** on any course card to inspect the exact raw values and weighted contributions of $T, K, D, P,$ and $F$.

---

## 📈 4. Measurable Offline Model Evaluation

The Hybrid Model was rigorously benchmarked using standard Information Retrieval metrics against both a **Popularity Baseline** (ranking by enrollments and rating) and a **Random Baseline**:

| Evaluation Metric | Hybrid TF-IDF Model (Ours) | Popularity Baseline | Random Baseline | Relative Lift |
| :--- | :---: | :---: | :---: | :---: |
| **Precision@3** | **0.5333** | 0.2000 | 0.2666 | **+166.7%** |
| **Precision@5** | **0.3600** | 0.2000 | 0.2400 | **+80.0%** |
| **Recall@3** | **0.6500** | 0.2000 | 0.2833 | **+225.0%** |
| **Recall@5** | **0.7000** | 0.3167 | 0.4167 | **+121.0%** |
| **NDCG@3** (Ranking Quality) | **1.0000** | 0.3101 | 0.6524 | **+222.5%** |
| **NDCG@5** (Ranking Quality) | **1.0000** | 0.3915 | 0.6604 | **+155.4%** |
| **MRR** (Mean Reciprocal Rank) | **1.0000** | 0.3908 | 0.6182 | **+155.9%** |
| **MAP** (Mean Average Precision) | **0.7753** | 0.3482 | 0.4328 | **+122.7%** |

*Evaluation script executable at any time via: `python ml_service/evaluate_model.py`*

---

## 🛠️ 5. Complete Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Single-page responsive interactive client |
| **Styling** | Tailwind CSS | Modern responsive design with custom theme accents |
| **Icons & UI** | Lucide React | High quality semantic SVG iconography |
| **Charts & Graphs**| Recharts | Interactive Weekly Activity BarCharts and Skill Radar graphs |
| **Backend API** | Node.js + Express.js | High-throughput REST API with authentication and controllers |
| **Database** | MongoDB / Resilient Dual Store | Mongoose models with automatic zero-downtime JSON store fallback |
| **AI / ML Engine** | Python 3 + Scikit-Learn | TF-IDF vectorization, Cosine Similarity, and scoring pipeline |
| **Authentication** | JWT + bcryptjs | Secure password hashing and tokenized authorization |
| **HTTP Client** | Axios | Request interceptors and proxy routing |

---

## ⚡ 6. Quick Start & Execution

### Prerequisites
- **Node.js** (v18+ or v20+)
- **Python** (3.10+ or 3.13+) with `scikit-learn`, `flask`, `flask-cors`, `pandas`, `numpy`

### Option A: One-Click Windows Launch
Double-click or run:
```cmd
start-all.bat
```
*(Or in PowerShell: `.\start-all.ps1`)*

### Option B: Manual Terminal Execution

#### 1. Start Python ML Microservice (Port 5001)
```bash
cd ml_service
pip install -r requirements.txt
python app.py
```

#### 2. Start Node.js REST API Server (Port 5000)
```bash
cd server
npm install
npm run seed      # (Populates 25+ courses, 6 careers, demo accounts)
npm start
```

#### 3. Start React Frontend (Port 3000)
```bash
cd client
npm install
npm run dev
```

Open your browser to: **`http://localhost:3000`**

---

## 🔑 7. Demo User Credentials

For portfolio evaluation and interview demos, the platform includes pre-configured accounts with full historical activity:

| Account Type | Email | Password | Role & Profile State |
| :--- | :--- | :--- | :--- |
| **Demo Student** | `student@example.com` | `password123` | **Student**: Target Career *Data Analyst*, skills (Python, Excel, SQL), enrollments, logged study hours, and personalized recommendations. |
| **Demo Admin** | `admin@example.com` | `admin123` | **Administrator**: Full CRUD permissions on courses, CSV bulk importer, registered user audit, and ML metrics. |

*You can also use the **"⚡ 1-Click Demo Sign In"** button on the login modal to authenticate instantly without typing!*

---

## 📡 8. REST API Reference

| Method | Endpoint | Access | Purpose |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT |
| `GET` | `/api/auth/me` | Protected | Fetch currently authenticated user |
| `GET` | `/api/users/profile` | Protected | Get user profile and competency list |
| `PUT` | `/api/users/profile` | Protected | Update skills, proficiencies, and career goal |
| `GET` | `/api/users/all` | Admin | List all registered learners and progress |
| `GET` | `/api/courses` | Public | Search, category/difficulty filters, sort, paginate |
| `GET` | `/api/courses/:id` | Public | Fetch detailed course syllabus and outcomes |
| `POST` | `/api/courses` | Admin | Create a new course entry |
| `PUT` | `/api/courses/:id` | Admin | Update course metadata |
| `DELETE` | `/api/courses/:id` | Admin | Remove course from catalog |
| `POST` | `/api/courses/import-csv` | Admin | Bulk ingestion of courses via CSV text |
| `GET` | `/api/recommendations` | Protected | Fetch top personalized courses with explanations |
| `POST` | `/api/recommendations/feedback` | Protected | Submit like, dislike, bookmark, or dismiss feedback |
| `GET` | `/api/recommendations/metrics` | Public | Retrieve offline ML evaluation results |
| `GET` | `/api/skills/gap` | Protected | Calculate competency delta vs target career |
| `GET` | `/api/roadmaps` | Protected | Retrieve sequenced 4-stage learning roadmap |
| `PATCH` | `/api/roadmaps/step/:num` | Protected | Toggle step completion status |
| `GET` | `/api/enrollments` | Protected | Get active courses in progress, completed, and wishlist |
| `POST` | `/api/enrollments` | Protected | Enroll in course or save to wishlist |
| `PATCH` | `/api/enrollments/:id` | Protected | Update progress % and log study hours |
| `GET` | `/api/analytics` | Protected | Calculate study statistics and chart datasets |
| `POST` | `/api/assistant/chat` | Protected | Natural language query grounded in catalog |

---

## 💼 9. Resume & Interview Portfolio Description

**AI-Powered Course Recommendation System**  
*Technologies: React.js, Node.js, Express.js, MongoDB, Python, Scikit-learn, NLP (TF-IDF), Tailwind CSS*  
- Developed a full-stack learning platform providing explainable course recommendations personalized by learner competencies, career targets, experience levels, and historical feedback.
- Engineered a hybrid recommendation engine in Python using TF-IDF vectorization, cosine similarity, Jaccard skill-gap scoring, and difficulty matrices: $S = 0.40T + 0.30K + 0.15D + 0.10P + 0.05F$.
- Evaluated model quality through offline IR metrics, achieving **1.000 NDCG@5**, **0.775 MAP**, and **0.533 Precision@3**, representing a **+166.7% improvement** over popularity-based baselines.
- Built automated career skill-gap analysis across 6 industry roles and an intelligent 4-stage pedagogical roadmap sequencer.
- Designed a catalog-grounded AI learning assistant answering prerequisite and study scheduling queries without external hallucinations.
- Architected a resilient dual-mode data layer connecting to MongoDB with a zero-downtime JSON store fallback, ensuring 100% crash-free out-of-the-box local execution.
