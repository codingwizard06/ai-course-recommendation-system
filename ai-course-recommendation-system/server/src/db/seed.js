const bcrypt = require('bcryptjs');

const INITIAL_COURSES = [
  // --- Data Science & Analytics ---
  {
    _id: "course_da_01",
    title: "Python for Data Analysis and Scientific Computing",
    description: "Master Python libraries including Pandas, NumPy, and Matplotlib. Learn data wrangling, cleaning dirty datasets, and exploratory analysis on real business telemetry.",
    provider: "Coursera / University of Michigan",
    instructor: "Dr. Christopher Brooks",
    category: "Data Science",
    difficulty: "Beginner",
    durationHours: 24,
    format: "video",
    rating: 4.8,
    reviewsCount: 14500,
    enrollmentCount: 68000,
    skills: ["Python", "Pandas", "NumPy", "Data Cleaning", "Data Analysis"],
    prerequisites: ["Basic Computer Literacy"],
    url: "https://www.coursera.org/learn/python-data-analysis",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    price: 0,
    isFeatured: true
  },
  {
    _id: "course_da_02",
    title: "Complete SQL Bootcamp: Go from Zero to Hero",
    description: "Learn how to read and write complex queries to a database using PostgreSQL. Perform joins, subqueries, group by aggregations, and window functions for analytics.",
    provider: "Udemy",
    instructor: "Jose Portilla",
    category: "Data Science",
    difficulty: "Beginner",
    durationHours: 18,
    format: "interactive",
    rating: 4.7,
    reviewsCount: 32000,
    enrollmentCount: 125000,
    skills: ["SQL", "PostgreSQL", "Database Design", "Queries", "Data Modeling"],
    prerequisites: ["None"],
    url: "https://www.udemy.com/course/the-complete-sql-bootcamp",
    imageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    price: 19.99,
    isFeatured: true
  },
  {
    _id: "course_da_03",
    title: "Microsoft Power BI Desktop for Business Intelligence",
    description: "Hands-on Power BI training to transform raw tables into dynamic executive dashboards. Master DAX measures, star schema relationships, and interactive storytelling.",
    provider: "Udemy / Maven Analytics",
    instructor: "Chris Dutton & Aaron Parry",
    category: "Data Science",
    difficulty: "Beginner",
    durationHours: 22,
    format: "video",
    rating: 4.6,
    reviewsCount: 18900,
    enrollmentCount: 84000,
    skills: ["Power BI", "DAX", "Data Visualization", "Dashboards", "Business Intelligence"],
    prerequisites: ["Basic Excel Familiarity"],
    url: "https://www.udemy.com/course/microsoft-power-bi-up-running-with-power-bi-desktop",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    price: 24.99,
    isFeatured: true
  },
  {
    _id: "course_da_04",
    title: "Practical Statistics for Data Scientists & Analysts",
    description: "Essential statistical methods covering hypothesis testing, confidence intervals, regression diagnostics, p-values, and A/B test validation in Python.",
    provider: "edX / Harvard Online",
    instructor: "Prof. Rafael Irizarry",
    category: "Data Science",
    difficulty: "Beginner",
    durationHours: 20,
    format: "reading",
    rating: 4.7,
    reviewsCount: 8400,
    enrollmentCount: 42000,
    skills: ["Statistics", "Probability", "Hypothesis Testing", "A/B Testing", "Python"],
    prerequisites: ["High School Math"],
    url: "https://www.edx.org/learn/data-analysis/harvard-university-data-science-linear-regression",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    price: 0,
    isFeatured: false
  },
  {
    _id: "course_da_05",
    title: "Data Visualization with Tableau Specialization",
    description: "Create impactful business visualizations, geospatial maps, and predictive chart forecasts using Tableau Desktop and Tableau Server.",
    provider: "Coursera / UC Davis",
    instructor: "Govind Acharya",
    category: "Data Science",
    difficulty: "Intermediate",
    durationHours: 28,
    format: "project",
    rating: 4.6,
    reviewsCount: 6500,
    enrollmentCount: 39000,
    skills: ["Tableau", "Data Visualization", "Storyboarding", "Business Analytics"],
    prerequisites: ["Basic Data Analysis"],
    url: "https://www.coursera.org/specializations/data-visualization",
    imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800",
    price: 0,
    isFeatured: false
  },
  {
    _id: "course_da_06",
    title: "Advanced Excel Formulas, Power Query and Financial Modeling",
    description: "Deep dive into INDEX/MATCH, XLOOKUP, nested conditions, pivot charts, and ETL data transformation pipelines via Power Query.",
    provider: "Coursera / Macquarie University",
    instructor: "Dr. Prashan Karunaratne",
    category: "Data Science",
    difficulty: "Intermediate",
    durationHours: 16,
    format: "interactive",
    rating: 4.9,
    reviewsCount: 22000,
    enrollmentCount: 95000,
    skills: ["Excel", "Power Query", "Data Modeling", "Spreadsheets", "Formulas"],
    prerequisites: ["Basic Excel"],
    url: "https://www.coursera.org/learn/excel-advanced",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
    price: 0,
    isFeatured: false
  },

  // --- Web Development ---
  {
    _id: "course_web_01",
    title: "The Complete 2026 Web Development Bootcamp",
    description: "The only course you need to learn to code. Covers HTML5, CSS3, modern JavaScript, Node.js, Express, MongoDB, React, Git and RESTful API engineering.",
    provider: "Udemy / App Brewery",
    instructor: "Dr. Angela Yu",
    category: "Web Development",
    difficulty: "Beginner",
    durationHours: 65,
    format: "project",
    rating: 4.8,
    reviewsCount: 160000,
    enrollmentCount: 480000,
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "MongoDB", "React"],
    prerequisites: ["No Programming Experience Required"],
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    price: 19.99,
    isFeatured: true
  },
  {
    _id: "course_web_02",
    title: "Full Stack React, Node.js and MongoDB Masterclass",
    description: "Production-grade MERN architecture: Redux Toolkit, JWT auth, secure refresh tokens, file uploads, Tailwind CSS, and scalable microservice integration.",
    provider: "Frontend Masters",
    instructor: "Scott Moss",
    category: "Web Development",
    difficulty: "Intermediate",
    durationHours: 35,
    format: "video",
    rating: 4.9,
    reviewsCount: 11000,
    enrollmentCount: 52000,
    skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs", "Tailwind CSS"],
    prerequisites: ["JavaScript Basics"],
    url: "https://frontendmasters.com/courses/fullstack-v3",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    price: 39.00,
    isFeatured: true
  },
  {
    _id: "course_web_03",
    title: "Next.js 14 & Tailwind CSS Enterprise Architecture",
    description: "Build ultra-fast web apps using Server Components, Streaming SSR, App Router, Server Actions, optimistic UI mutations, and responsive UI with Tailwind.",
    provider: "Vercel Academy",
    instructor: "Lee Robinson",
    category: "Web Development",
    difficulty: "Intermediate",
    durationHours: 25,
    format: "interactive",
    rating: 4.8,
    reviewsCount: 9200,
    enrollmentCount: 46000,
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Server Components"],
    prerequisites: ["React Fundamentals"],
    url: "https://nextjs.org/learn",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    price: 0,
    isFeatured: false
  },
  {
    _id: "course_web_04",
    title: "Modern TypeScript: The Complete Developer's Guide",
    description: "Master TypeScript types, generics, decorators, compiler options, design patterns, and integrating type-safety into Express and React apps.",
    provider: "Udemy",
    instructor: "Stephen Grider",
    category: "Web Development",
    difficulty: "Intermediate",
    durationHours: 24,
    format: "video",
    rating: 4.8,
    reviewsCount: 24000,
    enrollmentCount: 98000,
    skills: ["TypeScript", "JavaScript", "Generics", "Design Patterns"],
    prerequisites: ["ES6 JavaScript"],
    url: "https://www.udemy.com/course/typescript-the-complete-developers-guide",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    price: 18.99,
    isFeatured: false
  },
  {
    _id: "course_web_05",
    title: "Python Web Development with FastAPI & Asynchronous Architecture",
    description: "Build blazing-fast modern backend APIs with Python 3, Pydantic validation, Asyncio, SQLAlchemy ORM, and automated Swagger OpenAPI documentation.",
    provider: "freeCodeCamp",
    instructor: "Sanjeev Thiyagarajan",
    category: "Web Development",
    difficulty: "Intermediate",
    durationHours: 19,
    format: "video",
    rating: 4.8,
    reviewsCount: 14000,
    enrollmentCount: 72000,
    skills: ["Python", "FastAPI", "REST APIs", "SQLAlchemy", "PostgreSQL"],
    prerequisites: ["Python Basics"],
    url: "https://www.freecodecamp.org/news/fastapi-course",
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
    price: 0,
    isFeatured: false
  },

  // --- Machine Learning & AI ---
  {
    _id: "course_ml_01",
    title: "Machine Learning Specialization",
    description: "Foundational AI curriculum created by Andrew Ng. Master supervised learning, linear/logistic regression, decision trees, random forests, and unsupervised clustering.",
    provider: "Coursera / DeepLearning.AI & Stanford",
    instructor: "Andrew Ng",
    category: "Machine Learning",
    difficulty: "Beginner",
    durationHours: 35,
    format: "video",
    rating: 4.9,
    reviewsCount: 38000,
    enrollmentCount: 210000,
    skills: ["Machine Learning", "Python", "Scikit-Learn", "Supervised Learning", "Regression"],
    prerequisites: ["Basic Python", "High School Algebra"],
    url: "https://www.coursera.org/specializations/machine-learning-introduction",
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef0538821e1b?w=800",
    price: 0,
    isFeatured: true
  },
  {
    _id: "course_ml_02",
    title: "Deep Learning Specialization with PyTorch",
    description: "Build and train neural network architectures: multi-layer perceptrons, convolutional neural networks (CNNs), residual networks, and recurrent networks in PyTorch.",
    provider: "Coursera / DeepLearning.AI",
    instructor: "Andrew Ng & Kian Katanforoosh",
    category: "Machine Learning",
    difficulty: "Advanced",
    durationHours: 50,
    format: "project",
    rating: 4.9,
    reviewsCount: 41000,
    enrollmentCount: 175000,
    skills: ["PyTorch", "Deep Learning", "Neural Networks", "CNNs", "Computer Vision"],
    prerequisites: ["Python", "Linear Algebra", "Calculus Basics"],
    url: "https://www.coursera.org/specializations/deep-learning",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
    price: 0,
    isFeatured: true
  },
  {
    _id: "course_ml_03",
    title: "Natural Language Processing with Transformers & Hugging Face",
    description: "Learn modern NLP from TF-IDF and word embeddings to BERT, RoBERTa, GPT tokenization, sequence classification, and text generation with Hugging Face Transformers.",
    provider: "Hugging Face / Coursera",
    instructor: "Lewis Tunstall & Leandro von Werra",
    category: "Machine Learning",
    difficulty: "Intermediate",
    durationHours: 28,
    format: "interactive",
    rating: 4.8,
    reviewsCount: 7800,
    enrollmentCount: 45000,
    skills: ["NLP", "Transformers", "Hugging Face", "BERT", "Python", "Tokenization"],
    prerequisites: ["Python", "Machine Learning Basics"],
    url: "https://huggingface.co/learn/nlp-course",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    price: 0,
    isFeatured: false
  },
  {
    _id: "course_ml_04",
    title: "Generative AI & LLMs in Production: RAG & Fine-Tuning",
    description: "Build production-grade retrieval augmented generation (RAG) applications using vector databases (Pinecone, ChromaDB), LangChain, semantic search, and LoRA fine-tuning.",
    provider: "DeepLearning.AI",
    instructor: "Harrison Chase",
    category: "Machine Learning",
    difficulty: "Advanced",
    durationHours: 30,
    format: "project",
    rating: 4.9,
    reviewsCount: 12500,
    enrollmentCount: 62000,
    skills: ["Generative AI", "LLMs", "RAG", "Vector Databases", "LangChain", "Prompt Engineering"],
    prerequisites: ["Python", "Deep Learning Fundamentals"],
    url: "https://www.deeplearning.ai/courses/generative-ai-with-llms",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    price: 49.00,
    isFeatured: true
  },

  // --- Cloud & DevOps ---
  {
    _id: "course_cloud_01",
    title: "AWS Certified Solutions Architect Associate (SAA-C03)",
    description: "Comprehensive exam prep covering AWS compute (EC2, Lambda), storage (S3, EBS), VPC networking, IAM security, RDS databases, and resilient multi-tier design.",
    provider: "A Cloud Guru / Pluralsight",
    instructor: "Faye Ellis & Ryan Kroonenburg",
    category: "Cloud & DevOps",
    difficulty: "Beginner",
    durationHours: 38,
    format: "video",
    rating: 4.8,
    reviewsCount: 29000,
    enrollmentCount: 110000,
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "VPC", "IAM"],
    prerequisites: ["Basic IT or Networking"],
    url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    price: 29.99,
    isFeatured: true
  },
  {
    _id: "course_cloud_02",
    title: "Docker & Kubernetes: The Practical Guide to Microservices",
    description: "Build container images, run multi-container Docker Compose stacks, deploy onto Kubernetes clusters, configure pods, services, ingress, and volume storage.",
    provider: "Udemy / Academind",
    instructor: "Maximilian Schwarzmüller",
    category: "Cloud & DevOps",
    difficulty: "Intermediate",
    durationHours: 32,
    format: "interactive",
    rating: 4.8,
    reviewsCount: 31000,
    enrollmentCount: 130000,
    skills: ["Docker", "Kubernetes", "Containers", "Microservices", "DevOps"],
    prerequisites: ["Basic Web Development or Linux"],
    url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide",
    imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800",
    price: 19.99,
    isFeatured: true
  },
  {
    _id: "course_cloud_03",
    title: "Automated CI/CD Pipelines with GitHub Actions & ArgoCD",
    description: "Implement continuous integration, unit testing, automated security vulnerability scans, semantic versioning, and GitOps deployments into Kubernetes.",
    provider: "Linux Foundation / edX",
    instructor: "Viktor Farcic",
    category: "Cloud & DevOps",
    difficulty: "Advanced",
    durationHours: 26,
    format: "project",
    rating: 4.7,
    reviewsCount: 5400,
    enrollmentCount: 28000,
    skills: ["CI/CD", "GitHub Actions", "GitOps", "DevOps", "Kubernetes"],
    prerequisites: ["Git", "Docker Basics"],
    url: "https://training.linuxfoundation.org/training/gitops-continuous-delivery-on-kubernetes-with-flux",
    imageUrl: "https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800",
    price: 0,
    isFeatured: false
  },
  {
    _id: "course_cloud_04",
    title: "Terraform for Cloud Infrastructure Automation (IaC)",
    description: "Manage multi-cloud infrastructure declaratively with HashiCorp Terraform HCL syntax, modules, remote state backends, and zero-downtime provisioning.",
    provider: "Udemy",
    instructor: "Zeal Vora",
    category: "Cloud & DevOps",
    difficulty: "Intermediate",
    durationHours: 19,
    format: "video",
    rating: 4.7,
    reviewsCount: 12000,
    enrollmentCount: 59000,
    skills: ["Terraform", "Infrastructure as Code", "AWS", "Automation", "DevOps"],
    prerequisites: ["Cloud Computing Basics"],
    url: "https://www.udemy.com/course/terraform-certified",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    price: 16.99,
    isFeatured: false
  },

  // --- Cybersecurity ---
  {
    _id: "course_sec_01",
    title: "Cybersecurity Fundamentals & Network Defense",
    description: "Learn fundamental security principles, cryptography, network sniffing with Wireshark, firewall configurations, and intrusion detection systems.",
    provider: "edX / MIT",
    instructor: "Prof. Nickolai Zeldovich",
    category: "Cybersecurity",
    difficulty: "Beginner",
    durationHours: 26,
    format: "video",
    rating: 4.7,
    reviewsCount: 9500,
    enrollmentCount: 51000,
    skills: ["Networking", "Cybersecurity", "Cryptography", "Firewalls", "Security Auditing"],
    prerequisites: ["Basic Computing"],
    url: "https://www.edx.org/learn/cybersecurity",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800",
    price: 0,
    isFeatured: true
  },
  {
    _id: "course_sec_02",
    title: "CompTIA Security+ (SY0-701) Complete Training Course",
    description: "Pass your Security+ certification. Covers threat vectors, risk management, identity and access control, public key infrastructure, and compliance controls.",
    provider: "Udemy / Dion Training",
    instructor: "Jason Dion",
    category: "Cybersecurity",
    difficulty: "Beginner",
    durationHours: 34,
    format: "video",
    rating: 4.8,
    reviewsCount: 42000,
    enrollmentCount: 180000,
    skills: ["CompTIA Security+", "Threat Analysis", "Access Control", "Risk Management", "Security Policy"],
    prerequisites: ["Network Fundamentals"],
    url: "https://www.udemy.com/course/securityplus",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    price: 19.99,
    isFeatured: false
  },
  {
    _id: "course_sec_03",
    title: "Practical Web Application Penetration Testing",
    description: "Hands-on ethical hacking covering the OWASP Top 10: SQL injection, cross-site scripting (XSS), CSRF, authentication bypass, Burp Suite, and ethical reporting.",
    provider: "TCM Security",
    instructor: "Heath Adams (The Cyber Mentor)",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    durationHours: 30,
    format: "interactive",
    rating: 4.9,
    reviewsCount: 14000,
    enrollmentCount: 65000,
    skills: ["Ethical Hacking", "Penetration Testing", "OWASP", "Burp Suite", "SQL Injection", "XSS"],
    prerequisites: ["Web Basics", "Linux Basics"],
    url: "https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    price: 29.99,
    isFeatured: true
  },

  // --- UI/UX Design ---
  {
    _id: "course_ui_01",
    title: "Google UX Design Professional Certificate",
    description: "Learn the foundational UX design process: empathizing with users, defining pain points, ideating wireframes, conducting usability studies, and prototyping in Figma.",
    provider: "Coursera / Google",
    instructor: "Google Design Team",
    category: "UI/UX Design",
    difficulty: "Beginner",
    durationHours: 40,
    format: "project",
    rating: 4.8,
    reviewsCount: 62000,
    enrollmentCount: 310000,
    skills: ["UX Research", "Figma", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
    prerequisites: ["None"],
    url: "https://www.coursera.org/professional-certificates/google-ux-design",
    imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800",
    price: 0,
    isFeatured: true
  },
  {
    _id: "course_ui_02",
    title: "Figma UI/UX Masterclass: Advanced Design Systems & Auto-Layout",
    description: "Master modern Figma 2026: component variants, nested auto-layout, design tokens, interactive micro-animations, variables, and developer handoff mode.",
    provider: "Design+Code",
    instructor: "Meng To",
    category: "UI/UX Design",
    difficulty: "Intermediate",
    durationHours: 20,
    format: "interactive",
    rating: 4.9,
    reviewsCount: 9800,
    enrollmentCount: 47000,
    skills: ["Figma", "Design Systems", "UI Design", "Auto Layout", "Micro-interactions"],
    prerequisites: ["Basic UI Design"],
    url: "https://designcode.io/figma-handbook",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
    price: 29.00,
    isFeatured: false
  },
  {
    _id: "course_ui_03",
    title: "User Experience Research & Usability Testing Lab",
    description: "Plan and execute generative user interviews, card sorting, quantitative tree tests, cognitive walkthroughs, and translate findings into UX metrics (SUS, NPS).",
    provider: "Interaction Design Foundation",
    instructor: "Dr. Susan Weinschenk",
    category: "UI/UX Design",
    difficulty: "Intermediate",
    durationHours: 18,
    format: "reading",
    rating: 4.7,
    reviewsCount: 4600,
    enrollmentCount: 22000,
    skills: ["UX Research", "Usability Testing", "User Interviews", "Information Architecture"],
    prerequisites: ["UX Fundamentals"],
    url: "https://www.interaction-design.org/courses/user-research-methods-and-best-practices",
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
    price: 0,
    isFeatured: false
  }
];

const INITIAL_CAREERS = [
  {
    _id: "career_da",
    title: "Data Analyst",
    description: "Extract, clean, analyze, and visualize data to deliver actionable insights that drive executive decision-making and product optimization.",
    category: "Data Science",
    requiredSkills: [
      { name: "SQL", importance: "essential", targetProficiency: 85 },
      { name: "Python", importance: "essential", targetProficiency: 80 },
      { name: "Excel", importance: "essential", targetProficiency: 85 },
      { name: "Power BI", importance: "important", targetProficiency: 75 },
      { name: "Tableau", importance: "important", targetProficiency: 70 },
      { name: "Statistics", importance: "essential", targetProficiency: 75 },
      { name: "Data Visualization", importance: "essential", targetProficiency: 80 }
    ],
    foundationalSkills: ["Excel", "SQL", "Statistics"],
    advancedSkills: ["Python", "Power BI", "A/B Testing"],
    avgSalary: "$85,000 - $115,000 / yr",
    jobOutlook: "High (+25% growth over 5 years)",
    recommendedLearningWeeks: 20
  },
  {
    _id: "career_fsd",
    title: "Full Stack Developer",
    description: "Architect and build modern web applications from responsive frontend interfaces down to high-throughput REST APIs and database layers.",
    category: "Web Development",
    requiredSkills: [
      { name: "JavaScript", importance: "essential", targetProficiency: 90 },
      { name: "React", importance: "essential", targetProficiency: 85 },
      { name: "Node.js", importance: "essential", targetProficiency: 85 },
      { name: "MongoDB", importance: "important", targetProficiency: 75 },
      { name: "HTML", importance: "essential", targetProficiency: 90 },
      { name: "CSS", importance: "essential", targetProficiency: 85 },
      { name: "TypeScript", importance: "important", targetProficiency: 75 },
      { name: "REST APIs", importance: "essential", targetProficiency: 85 }
    ],
    foundationalSkills: ["HTML", "CSS", "JavaScript"],
    advancedSkills: ["React", "Node.js", "TypeScript", "Next.js"],
    avgSalary: "$95,000 - $135,000 / yr",
    jobOutlook: "Very High (+23% growth)",
    recommendedLearningWeeks: 24
  },
  {
    _id: "career_mle",
    title: "Machine Learning Engineer",
    description: "Design, train, evaluate, and deploy scalable machine learning algorithms and neural networks to production environments.",
    category: "Machine Learning",
    requiredSkills: [
      { name: "Python", importance: "essential", targetProficiency: 90 },
      { name: "Machine Learning", importance: "essential", targetProficiency: 85 },
      { name: "Scikit-Learn", importance: "essential", targetProficiency: 85 },
      { name: "Deep Learning", importance: "essential", targetProficiency: 80 },
      { name: "PyTorch", importance: "important", targetProficiency: 80 },
      { name: "Statistics", importance: "essential", targetProficiency: 80 },
      { name: "Generative AI", importance: "important", targetProficiency: 70 }
    ],
    foundationalSkills: ["Python", "Statistics", "Scikit-Learn"],
    advancedSkills: ["Deep Learning", "PyTorch", "Transformers", "RAG"],
    avgSalary: "$120,000 - $165,000 / yr",
    jobOutlook: "Exceptional (+40% growth)",
    recommendedLearningWeeks: 32
  },
  {
    _id: "career_devops",
    title: "Cloud DevOps Engineer",
    description: "Automate infrastructure deployment, streamline CI/CD delivery pipelines, and ensure high availability, scalability, and cloud resilience.",
    category: "Cloud & DevOps",
    requiredSkills: [
      { name: "Docker", importance: "essential", targetProficiency: 85 },
      { name: "Kubernetes", importance: "essential", targetProficiency: 80 },
      { name: "AWS", importance: "essential", targetProficiency: 85 },
      { name: "CI/CD", importance: "essential", targetProficiency: 80 },
      { name: "Linux", importance: "essential", targetProficiency: 85 },
      { name: "Terraform", importance: "important", targetProficiency: 75 }
    ],
    foundationalSkills: ["Linux", "Docker", "AWS"],
    advancedSkills: ["Kubernetes", "CI/CD", "Terraform"],
    avgSalary: "$110,000 - $150,000 / yr",
    jobOutlook: "Very High (+28% growth)",
    recommendedLearningWeeks: 26
  },
  {
    _id: "career_sec",
    title: "Cybersecurity Analyst",
    description: "Protect organizational networks, systems, and sensitive data by detecting vulnerabilities, performing audits, and mitigating security threats.",
    category: "Cybersecurity",
    requiredSkills: [
      { name: "Networking", importance: "essential", targetProficiency: 85 },
      { name: "Cybersecurity", importance: "essential", targetProficiency: 85 },
      { name: "Ethical Hacking", importance: "important", targetProficiency: 75 },
      { name: "CompTIA Security+", importance: "essential", targetProficiency: 80 },
      { name: "Penetration Testing", importance: "important", targetProficiency: 70 }
    ],
    foundationalSkills: ["Networking", "Cybersecurity", "Linux"],
    advancedSkills: ["Penetration Testing", "Security Auditing", "Threat Analysis"],
    avgSalary: "$90,000 - $130,000 / yr",
    jobOutlook: "Very High (+32% growth)",
    recommendedLearningWeeks: 24
  },
  {
    _id: "career_uiux",
    title: "UI/UX Designer",
    description: "Craft intuitive, accessible user interfaces, conduct empathetic user research, and build scalable interactive design systems.",
    category: "UI/UX Design",
    requiredSkills: [
      { name: "Figma", importance: "essential", targetProficiency: 90 },
      { name: "UI Design", importance: "essential", targetProficiency: 85 },
      { name: "UX Research", importance: "essential", targetProficiency: 85 },
      { name: "Wireframing", importance: "essential", targetProficiency: 85 },
      { name: "Design Systems", importance: "important", targetProficiency: 80 },
      { name: "Usability Testing", importance: "important", targetProficiency: 75 }
    ],
    foundationalSkills: ["UI Design", "Figma", "Wireframing"],
    advancedSkills: ["Design Systems", "UX Research", "Usability Testing"],
    avgSalary: "$85,000 - $120,000 / yr",
    jobOutlook: "Strong (+16% growth)",
    recommendedLearningWeeks: 20
  }
];

async function runSeed() {
  const db = require('./datastore');

  console.log('[Seed] Seeding realistic course catalog, careers, demo users...');

  // Clear existing
  await db.Course.deleteMany({});
  await db.Career.deleteMany({});
  await db.User.deleteMany({});
  await db.Enrollment.deleteMany({});
  await db.Feedback.deleteMany({});

  // Insert Courses & Careers
  await db.Course.insertMany(INITIAL_COURSES);
  await db.Career.insertMany(INITIAL_CAREERS);

  // Hash passwords
  const studentPassword = await bcrypt.hash('password123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Create Demo Student User
  const student = await db.User.create({
    _id: "user_demo_student",
    name: "Alex Johnson",
    email: "student@example.com",
    password: studentPassword,
    role: "student",
    educationLevel: "Bachelor's in Computer Science",
    currentSkills: [
      { name: "Python", proficiency: 60 },
      { name: "Excel", proficiency: 75 },
      { name: "SQL", proficiency: 35 },
      { name: "HTML", proficiency: 80 }
    ],
    preferredCategories: ["Data Science", "Machine Learning"],
    careerGoal: "Data Analyst",
    experienceLevel: "Beginner",
    preferredDuration: "medium",
    preferredFormat: "video",
    weeklyGoalHours: 12
  });

  // Create Demo Admin User
  await db.User.create({
    _id: "user_demo_admin",
    name: "Platform Administrator",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin",
    educationLevel: "Master's Degree",
    currentSkills: [
      { name: "Full Stack", proficiency: 95 },
      { name: "System Architecture", proficiency: 90 }
    ],
    preferredCategories: ["Web Development", "Cloud & DevOps"],
    careerGoal: "Engineering Manager",
    experienceLevel: "Advanced",
    preferredDuration: "medium",
    preferredFormat: "video",
    weeklyGoalHours: 15
  });

  // Create Initial Enrollments for Demo Student
  await db.Enrollment.create({
    userId: "user_demo_student",
    courseId: "course_da_02", // Complete SQL Bootcamp
    status: "in_progress",
    progressPercentage: 45,
    hoursSpent: 8.5,
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    rating: 5,
    notes: "Completed Section 4: Joins and Group By queries"
  });

  await db.Enrollment.create({
    userId: "user_demo_student",
    courseId: "course_da_04", // Practical Statistics
    status: "completed",
    progressPercentage: 100,
    hoursSpent: 20.0,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    rating: 5,
    notes: "Understood hypothesis testing and p-values!"
  });

  await db.Enrollment.create({
    userId: "user_demo_student",
    courseId: "course_da_01", // Python for Data Analysis
    status: "saved",
    progressPercentage: 0,
    hoursSpent: 0
  });

  // Seed sample feedback
  await db.Feedback.create({
    userId: "user_demo_student",
    courseId: "course_da_04",
    action: "like",
    weight: 1
  });

  await db.Feedback.create({
    userId: "user_demo_student",
    courseId: "course_da_02",
    action: "save",
    weight: 1
  });

  console.log(`[Seed] Seeded ${INITIAL_COURSES.length} courses, ${INITIAL_CAREERS.length} careers, and demo accounts!`);
  console.log('  Student: student@example.com / password123');
  console.log('  Admin:   admin@example.com / admin123');
}

module.exports = {
  runSeed,
  INITIAL_COURSES,
  INITIAL_CAREERS
};

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
