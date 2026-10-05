"""
recommender.py
Core AI/ML Recommendation Engine for Course Recommendation System.
Implements:
  - TF-IDF Vectorization & Cosine Similarity
  - Hybrid Relevance Scoring Formula: S = 0.40T + 0.30K + 0.15D + 0.10P + 0.05F
  - Explainable AI (XAI) rationale generation
  - Skill-gap analysis and proficiency scoring
  - Pedagogical learning roadmap generator
"""

import re
import math
from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class HybridCourseRecommender:
    """
    Hybrid Course Recommendation Engine combining Content-Based Filtering (TF-IDF + Cosine Similarity),
    Skill Matching, Difficulty Appropriateness, Learning Preferences, and Interaction Feedback.
    """

    def __init__(self, weight_t: float = 0.40, weight_k: float = 0.30, 
                 weight_d: float = 0.15, weight_p: float = 0.10, weight_f: float = 0.05):
        self.w_t = weight_t  # Textual TF-IDF similarity
        self.w_k = weight_k  # Skill coverage match
        self.w_d = weight_d  # Difficulty suitability
        self.w_p = weight_p  # Duration & format preference
        self.w_f = weight_f  # Feedback / interaction history

        self.vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            max_features=5000,
            token_pattern=r'(?u)\b[a-zA-Z0-9_+#.-]+\b'
        )
        self.courses: List[Dict[str, Any]] = []
        self.course_corpus: List[str] = []
        self.tfidf_matrix = None
        self.course_id_to_idx: Dict[str, int] = {}

    def _normalize_text(self, text: str) -> str:
        if not text:
            return ""
        return re.sub(r'\s+', ' ', str(text).strip().lower())

    def _build_course_document(self, course: Dict[str, Any]) -> str:
        """Create a dense textual document representing a course."""
        parts = [
            course.get("title", ""),
            course.get("title", ""),  # boost title weight
            course.get("category", ""),
            course.get("description", ""),
            " ".join(course.get("skills", [])),
            " ".join(course.get("skills", [])),  # boost skills weight
            course.get("provider", ""),
            course.get("instructor", ""),
            course.get("difficulty", "")
        ]
        return self._normalize_text(" ".join(parts))

    def index_courses(self, courses: List[Dict[str, Any]]):
        """Pre-index courses and compute TF-IDF matrix for high performance."""
        self.courses = courses
        self.course_id_to_idx = {str(c.get("id") or c.get("_id")): idx for idx, c in enumerate(courses)}
        self.course_corpus = [self._build_course_document(c) for c in courses]
        
        if self.course_corpus:
            self.tfidf_matrix = self.vectorizer.fit_transform(self.course_corpus)
        else:
            self.tfidf_matrix = None

    def _build_profile_document(self, profile: Dict[str, Any]) -> str:
        """Create a rich textual query document from learner profile."""
        career = profile.get("careerGoal", "")
        interests = " ".join(profile.get("interests", [])) if isinstance(profile.get("interests"), list) else str(profile.get("interests", ""))
        
        skills_raw = profile.get("skills", [])
        if isinstance(skills_raw, list):
            skill_names = [s.get("name") if isinstance(s, dict) else str(s) for s in skills_raw]
        else:
            skill_names = [str(skills_raw)]
        skills_str = " ".join(skill_names)
        
        experience = profile.get("experienceLevel", "")
        education = profile.get("educationLevel", "")
        target_role = profile.get("targetRole", "")
        
        doc = f"{career} {career} {target_role} {interests} {skills_str} {experience} {education}"
        return self._normalize_text(doc)

    def _calculate_difficulty_score(self, user_exp: str, course_diff: str) -> float:
        """
        Evaluate appropriateness of course difficulty against learner experience level.
        """
        user_exp = (user_exp or "beginner").lower().strip()
        course_diff = (course_diff or "all levels").lower().strip()

        if course_diff == "all levels":
            return 0.85

        matrix = {
            "beginner": {
                "beginner": 1.0,
                "intermediate": 0.45,
                "advanced": 0.10
            },
            "intermediate": {
                "beginner": 0.65,
                "intermediate": 1.0,
                "advanced": 0.75
            },
            "advanced": {
                "beginner": 0.30,
                "intermediate": 0.80,
                "advanced": 1.0
            }
        }
        
        exp_group = "beginner"
        if "intermediate" in user_exp or "mid" in user_exp:
            exp_group = "intermediate"
        elif "adv" in user_exp or "senior" in user_exp:
            exp_group = "advanced"

        diff_group = "intermediate"
        if "beg" in course_diff or "intro" in course_diff:
            diff_group = "beginner"
        elif "adv" in course_diff:
            diff_group = "advanced"

        return matrix.get(exp_group, {}).get(diff_group, 0.70)

    def _calculate_preference_score(self, profile: Dict[str, Any], course: Dict[str, Any]) -> float:
        """
        Evaluate duration and delivery format preferences.
        """
        score = 0.5  # base neutral score
        
        pref_duration = (profile.get("preferredDuration") or "medium").lower()
        duration_hours = course.get("durationHours") or course.get("duration", 20)
        try:
            duration_hours = float(duration_hours)
        except (ValueError, TypeError):
            duration_hours = 20.0

        # Duration match (0.25 max)
        if "short" in pref_duration:  # < 15 hours
            dur_match = 1.0 if duration_hours <= 15 else max(0.2, 1.0 - (duration_hours - 15) / 30)
        elif "long" in pref_duration:  # > 40 hours
            dur_match = 1.0 if duration_hours >= 40 else max(0.2, duration_hours / 40)
        else:  # medium: 15-40 hours
            dur_match = 1.0 if 15 <= duration_hours <= 40 else 0.6

        # Format match (0.25 max)
        pref_format = (profile.get("preferredFormat") or "video").lower()
        course_format = (course.get("format") or "video").lower()
        format_match = 1.0 if pref_format in course_format or course_format in pref_format else 0.5

        return (dur_match * 0.5) + (format_match * 0.5)

    def _calculate_skill_score(self, profile: Dict[str, Any], course: Dict[str, Any], target_career_skills: List[str] = None) -> Tuple[float, List[str], List[str]]:
        """
        Calculates skill match between course skills, user's current skills, and target career requirements.
        Returns: (skill_score, matched_skills, new_skills_unlocked)
        """
        course_skills = [s.lower().strip() for s in course.get("skills", [])]
        if not course_skills:
            return 0.3, [], []

        user_skills_raw = profile.get("skills", [])
        user_skills_map = {}
        for s in user_skills_raw:
            if isinstance(s, dict):
                user_skills_map[s.get("name", "").lower().strip()] = float(s.get("proficiency", 50))
            else:
                user_skills_map[str(s).lower().strip()] = 50.0

        career_skills = [s.lower().strip() for s in (target_career_skills or [])]

        matched_existing = []
        new_career_skills = []

        for cs in course_skills:
            # Check if learner has this skill
            found = False
            for us, prof in user_skills_map.items():
                if cs == us or cs in us or us in cs:
                    matched_existing.append(cs)
                    found = True
                    break
            
            # Check if it bridges a career gap
            if not found:
                for c_req in career_skills:
                    if cs == c_req or cs in c_req or c_req in cs:
                        new_career_skills.append(cs)
                        break

        total_course_skills = max(1, len(course_skills))
        
        # Skill score awards both reinforcing existing skills and filling missing career requirements
        score = (len(matched_existing) * 0.45 + len(new_career_skills) * 0.55) / total_course_skills
        return min(1.0, max(0.1, score)), matched_existing, new_career_skills

    def _calculate_feedback_score(self, course_id: str, feedback_list: List[Dict[str, Any]]) -> float:
        """
        Incorporates user interactions (likes, dislikes, completions, dismissals).
        """
        if not feedback_list:
            return 0.5  # neutral

        score = 0.5
        for fb in feedback_list:
            fb_course_id = str(fb.get("courseId") or fb.get("course_id"))
            if fb_course_id == str(course_id):
                action = (fb.get("action") or "").lower()
                if action == "like":
                    score = min(1.0, score + 0.4)
                elif action == "dislike":
                    score = max(0.0, score - 0.4)
                elif action == "completed":
                    score = min(1.0, score + 0.3)
                elif action == "save":
                    score = min(1.0, score + 0.25)
                elif action == "dismiss":
                    score = max(0.0, score - 0.35)
                elif action == "click":
                    score = min(1.0, score + 0.1)

        return score

    def _generate_explanation(self, course: Dict[str, Any], profile: Dict[str, Any], 
                              t_score: float, k_score: float, d_score: float,
                              matched_skills: List[str], new_skills: List[str]) -> str:
        """
        Generates human-readable, transparent AI explanation for why the course was chosen.
        """
        reasons = []
        career = profile.get("careerGoal", "")
        
        if new_skills:
            skills_formatted = ", ".join(f"'{s.title()}'" for s in new_skills[:3])
            reasons.append(f"Directly bridges critical skill gaps in {skills_formatted} required for your {career or 'career'} path")
        elif matched_skills:
            skills_formatted = ", ".join(f"'{s.title()}'" for s in matched_skills[:3])
            reasons.append(f"Strengthens your foundational knowledge in {skills_formatted}")

        if t_score > 0.45:
            reasons.append(f"Highly relevant to your stated interest in '{profile.get('interests', ['this field'])[0] if isinstance(profile.get('interests'), list) and profile.get('interests') else 'applied technologies'}'")

        diff = course.get("difficulty", "all levels")
        exp = profile.get("experienceLevel", "beginner")
        if d_score >= 0.85:
            reasons.append(f"Perfect difficulty fit for a {exp} learner ({diff.title()})")

        rating = course.get("rating", 4.5)
        if rating >= 4.7:
            reasons.append(f"Top-rated course ({rating}★) with proven learner success")

        if not reasons:
            return f"Curated recommendation matching your career goal in {career or 'modern tech'} and learning profile."

        return ". ".join(reasons) + "."

    def recommend(self, profile: Dict[str, Any], courses: List[Dict[str, Any]] = None, 
                  feedback_list: List[Dict[str, Any]] = None, 
                  target_career_skills: List[str] = None,
                  top_k: int = 10,
                  exclude_completed_ids: List[str] = None) -> List[Dict[str, Any]]:
        """
        Generates ranked course recommendations with scores and explanations.
        """
        target_courses = courses if courses is not None else self.courses
        if not target_courses:
            return []

        # Ensure TF-IDF matrix exists
        if courses is not None or self.tfidf_matrix is None:
            self.index_courses(target_courses)

        profile_doc = self._build_profile_document(profile)
        user_vector = self.vectorizer.transform([profile_doc])
        tfidf_scores = cosine_similarity(user_vector, self.tfidf_matrix).flatten()

        user_exp = profile.get("experienceLevel", "beginner")
        exclude_set = set(str(cid) for cid in (exclude_completed_ids or []))
        feedback_list = feedback_list or []

        ranked_results = []

        for idx, course in enumerate(target_courses):
            course_id = str(course.get("id") or course.get("_id") or f"c_{idx}")
            if course_id in exclude_set:
                continue

            # 1. Text Similarity T (0 - 1)
            t_score = float(tfidf_scores[idx])

            # 2. Skill Match K (0 - 1)
            k_score, matched_skills, new_skills = self._calculate_skill_score(
                profile, course, target_career_skills
            )

            # 3. Difficulty Match D (0 - 1)
            d_score = self._calculate_difficulty_score(user_exp, course.get("difficulty", "beginner"))

            # 4. Preference Match P (0 - 1)
            p_score = self._calculate_preference_score(profile, course)

            # 5. Feedback Score F (0 - 1)
            f_score = self._calculate_feedback_score(course_id, feedback_list)

            # Cold start fallback safeguard
            if t_score == 0 and k_score <= 0.1:
                # Add baseline boost based on course popularity/rating
                popularity_boost = min(0.3, (course.get("rating", 4.0) - 3.5) / 1.5 * 0.3)
                t_score += popularity_boost

            # Hybrid Score Formula
            final_score = (
                self.w_t * t_score +
                self.w_k * k_score +
                self.w_d * d_score +
                self.w_p * p_score +
                self.w_f * f_score
            )
            final_score = round(min(1.0, max(0.0, final_score)), 4)

            # Generate explainability rationale
            explanation = self._generate_explanation(
                course, profile, t_score, k_score, d_score, matched_skills, new_skills
            )

            result_item = dict(course)
            result_item["matchScore"] = round(final_score * 100, 1)  # percentage representation
            result_item["scoreDetails"] = {
                "finalScore": final_score,
                "textSimilarity": round(t_score, 3),
                "skillMatch": round(k_score, 3),
                "difficultySuitability": round(d_score, 3),
                "preferenceMatch": round(p_score, 3),
                "feedbackScore": round(f_score, 3),
                "weights": {
                    "text": self.w_t,
                    "skills": self.w_k,
                    "difficulty": self.w_d,
                    "preferences": self.w_p,
                    "feedback": self.w_f
                }
            }
            result_item["matchedSkills"] = matched_skills
            result_item["bridgedSkills"] = new_skills
            result_item["recommendationReason"] = explanation

            ranked_results.append(result_item)

        # Sort by final score descending
        ranked_results.sort(key=lambda x: x["scoreDetails"]["finalScore"], reverse=True)
        return ranked_results[:top_k]

    def analyze_skill_gap(self, user_skills: List[Dict[str, Any]], 
                          career_title: str,
                          required_skills: List[Dict[str, Any]], 
                          courses: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Analyzes the delta between learner's current competencies and career requirements.
        Categorizes skills into: Mastered (>=80%), In Progress (20-79%), Missing (<20%).
        """
        target_courses = courses if courses is not None else self.courses
        user_skills_dict = {}
        for s in user_skills:
            if isinstance(s, dict):
                user_skills_dict[s.get("name", "").lower().strip()] = float(s.get("proficiency", 50))
            else:
                user_skills_dict[str(s).lower().strip()] = 50.0

        mastered = []
        in_progress = []
        missing = []
        total_proficiency_points = 0.0
        max_possible_points = len(required_skills) * 100.0 if required_skills else 1.0

        for req in required_skills:
            req_name = req.get("name", "") if isinstance(req, dict) else str(req)
            req_clean = req_name.lower().strip()
            importance = req.get("importance", "essential") if isinstance(req, dict) else "essential"
            
            # Find best match in user skills
            user_prof = 0.0
            for u_name, u_prof in user_skills_dict.items():
                if req_clean == u_name or req_clean in u_name or u_name in req_clean:
                    user_prof = max(user_prof, u_prof)

            total_proficiency_points += user_prof

            # Course recommendations that teach this missing skill
            matching_courses = []
            if user_prof < 80 and target_courses:
                for c in target_courses:
                    c_skills = [cs.lower() for cs in c.get("skills", [])]
                    if any(req_clean in cs or cs in req_clean for cs in c_skills):
                        matching_courses.append({
                            "id": str(c.get("id") or c.get("_id")),
                            "title": c.get("title"),
                            "difficulty": c.get("difficulty"),
                            "provider": c.get("provider"),
                            "rating": c.get("rating"),
                            "durationHours": c.get("durationHours")
                        })
            
            skill_info = {
                "name": req_name,
                "currentProficiency": int(user_prof),
                "importance": importance,
                "targetProficiency": 100,
                "recommendedCourses": matching_courses[:3]
            }

            if user_prof >= 80:
                mastered.append(skill_info)
            elif user_prof >= 20:
                in_progress.append(skill_info)
            else:
                missing.append(skill_info)

        coverage_pct = round((total_proficiency_points / max_possible_points) * 100, 1)

        return {
            "careerTitle": career_title,
            "overallMatchPercentage": min(100.0, coverage_pct),
            "totalRequiredSkills": len(required_skills),
            "masteredSkillsCount": len(mastered),
            "inProgressSkillsCount": len(in_progress),
            "missingSkillsCount": len(missing),
            "masteredSkills": mastered,
            "inProgressSkills": in_progress,
            "missingSkills": missing,
            "readinessStatus": (
                "Job Ready" if coverage_pct >= 85 else
                "Approaching Readiness" if coverage_pct >= 60 else
                "Intermediate Development" if coverage_pct >= 35 else
                "Foundational Stage"
            )
        }

    def generate_roadmap(self, career_goal: str, profile: Dict[str, Any], 
                         courses: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Organizes courses into a coherent, phased learning sequence:
        Stage 1: Foundational Core
        Stage 2: Applied Competencies
        Stage 3: Advanced Specialization
        Stage 4: Industry Capstone & Portfolio
        """
        all_courses = courses if courses is not None else self.courses
        ranked = self.recommend(profile, all_courses, top_k=20)
        
        stages = {
            "Stage 1: Foundations & Core Prerequisites": [],
            "Stage 2: Core Engineering & Applied Tools": [],
            "Stage 3: Advanced Topics & Specialization": [],
            "Stage 4: Industry Capstone Project": []
        }

        user_skills_raw = [
            s.get("name", "").lower() if isinstance(s, dict) else str(s).lower()
            for s in profile.get("skills", [])
        ]

        step_counter = 1
        for c in ranked:
            diff = (c.get("difficulty") or "beginner").lower()
            skills = [s.lower() for s in c.get("skills", [])]
            
            # Determine stage based on difficulty and student progress
            if "beginner" in diff or "intro" in diff:
                stage_key = "Stage 1: Foundations & Core Prerequisites"
            elif "intermediate" in diff:
                stage_key = "Stage 2: Core Engineering & Applied Tools"
            else:
                stage_key = "Stage 3: Advanced Topics & Specialization"

            # Check if this course should be placed in Capstone stage
            if "project" in c.get("title", "").lower() or "capstone" in c.get("title", "").lower():
                stage_key = "Stage 4: Industry Capstone Project"

            # Check if student already has majority of skills
            is_completed = False
            overlap = sum(1 for s in skills if any(s in us or us in s for us in user_skills_raw))
            if overlap >= len(skills) and len(skills) > 0:
                is_completed = True

            step = {
                "stepNumber": step_counter,
                "courseId": str(c.get("id") or c.get("_id")),
                "title": c.get("title"),
                "provider": c.get("provider"),
                "difficulty": c.get("difficulty"),
                "durationHours": c.get("durationHours"),
                "skills": c.get("skills", []),
                "prerequisites": c.get("prerequisites", []),
                "isCompleted": is_completed,
                "status": "completed" if is_completed else ("in_progress" if step_counter == 1 else "locked"),
                "estimatedWeeks": max(1, math.ceil(float(c.get("durationHours", 20)) / 5))  # based on 5 hrs/week
            }

            if len(stages[stage_key]) < 3:
                stages[stage_key].append(step)
                step_counter += 1

        ordered_stages = []
        for stage_name, steps in stages.items():
            if steps:
                ordered_stages.append({
                    "stageTitle": stage_name,
                    "steps": steps,
                    "stageDurationWeeks": sum(s["estimatedWeeks"] for s in steps)
                })

        return {
            "careerGoal": career_goal,
            "totalSteps": sum(len(s["steps"]) for s in ordered_stages),
            "estimatedTotalWeeks": sum(s["stageDurationWeeks"] for s in ordered_stages),
            "stages": ordered_stages,
            "nextRecommendedStep": ordered_stages[0]["steps"][0] if ordered_stages and ordered_stages[0]["steps"] else None
        }
