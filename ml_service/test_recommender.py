"""
test_recommender.py
Unit tests for the Hybrid Course Recommender module.
"""

import unittest
from recommender import HybridCourseRecommender


class TestHybridRecommender(unittest.TestCase):

    def setUp(self):
        self.recommender = HybridCourseRecommender()
        self.sample_courses = [
            {
                "id": "c1",
                "title": "Python for Data Analysis",
                "category": "Data Science",
                "skills": ["Python", "Pandas", "NumPy"],
                "difficulty": "Beginner",
                "durationHours": 20,
                "format": "video",
                "rating": 4.8,
                "description": "Learn python, pandas, numpy for data science and analysis."
            },
            {
                "id": "c2",
                "title": "SQL for Relational Databases",
                "category": "Data Science",
                "skills": ["SQL", "PostgreSQL", "Database Design"],
                "difficulty": "Beginner",
                "durationHours": 15,
                "format": "interactive",
                "rating": 4.7,
                "description": "Master SQL queries, joins, and relational database management."
            },
            {
                "id": "c3",
                "title": "Advanced PyTorch Deep Learning",
                "category": "Machine Learning",
                "skills": ["PyTorch", "Deep Learning", "Transformers"],
                "difficulty": "Advanced",
                "durationHours": 45,
                "format": "video",
                "rating": 4.9,
                "description": "Advanced deep learning architectures with PyTorch."
            }
        ]
        self.recommender.index_courses(self.sample_courses)

    def test_recommendation_scoring_and_ranking(self):
        profile = {
            "careerGoal": "Data Analyst",
            "experienceLevel": "Beginner",
            "skills": [{"name": "Excel", "proficiency": 70}],
            "interests": ["Data Analysis", "Python"],
            "preferredDuration": "medium",
            "preferredFormat": "video"
        }
        recs = self.recommender.recommend(profile, self.sample_courses, top_k=2)
        self.assertGreaterEqual(len(recs), 1)
        self.assertEqual(recs[0]["id"], "c1")
        self.assertIn("scoreDetails", recs[0])
        self.assertIn("recommendationReason", recs[0])
        self.assertGreater(recs[0]["scoreDetails"]["finalScore"], 0)

    def test_cold_start_fallback(self):
        # Empty profile
        empty_profile = {
            "careerGoal": "",
            "experienceLevel": "Beginner",
            "skills": [],
            "interests": [],
            "preferredDuration": "",
            "preferredFormat": ""
        }
        recs = self.recommender.recommend(empty_profile, self.sample_courses, top_k=3)
        self.assertEqual(len(recs), 3)
        self.assertTrue(all(r["scoreDetails"]["finalScore"] >= 0 for r in recs))

    def test_skill_gap_analysis(self):
        user_skills = [{"name": "Python", "proficiency": 90}]
        required_skills = [
            {"name": "Python", "importance": "essential"},
            {"name": "SQL", "importance": "essential"},
            {"name": "Power BI", "importance": "important"}
        ]
        gap = self.recommender.analyze_skill_gap(
            user_skills=user_skills,
            career_title="Data Analyst",
            required_skills=required_skills,
            courses=self.sample_courses
        )
        self.assertEqual(gap["totalRequiredSkills"], 3)
        self.assertEqual(gap["masteredSkillsCount"], 1)  # Python
        self.assertEqual(gap["missingSkillsCount"], 2)   # SQL, Power BI
        self.assertGreaterEqual(gap["overallMatchPercentage"], 30.0)

    def test_roadmap_generation(self):
        profile = {
            "careerGoal": "Data Analyst",
            "experienceLevel": "Beginner",
            "skills": ["Excel"],
            "interests": ["Data Analysis"]
        }
        roadmap = self.recommender.generate_roadmap("Data Analyst", profile, self.sample_courses)
        self.assertIn("stages", roadmap)
        self.assertGreater(len(roadmap["stages"]), 0)
        self.assertIsNotNone(roadmap["nextRecommendedStep"])


if __name__ == "__main__":
    unittest.main()
