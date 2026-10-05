"""
evaluate_model.py
Benchmark evaluation of Hybrid Recommendation Engine against Popularity and Random Baselines.
Calculates Precision@K, Recall@K, NDCG@K, MRR, and MAP.
"""

import json
import math
import random
from typing import List, Dict, Any
import numpy as np
from recommender import HybridCourseRecommender

# Benchmark synthetic test course catalog
SAMPLE_COURSES = [
    {
        "id": "c1",
        "title": "Python for Data Analysis and Scientific Computing",
        "category": "Data Science",
        "skills": ["Python", "Pandas", "NumPy", "Data Analysis"],
        "difficulty": "Beginner",
        "durationHours": 24,
        "format": "video",
        "rating": 4.8,
        "enrollmentCount": 18500,
        "description": "Master Python libraries including Pandas, NumPy and Matplotlib for real-world exploratory data analysis."
    },
    {
        "id": "c2",
        "title": "SQL for Data Science and Relational Databases",
        "category": "Data Science",
        "skills": ["SQL", "PostgreSQL", "Database Design", "Queries"],
        "difficulty": "Beginner",
        "durationHours": 18,
        "format": "interactive",
        "rating": 4.7,
        "enrollmentCount": 24000,
        "description": "Learn SQL from scratch, write complex joins, window functions and aggregate queries for business insights."
    },
    {
        "id": "c3",
        "title": "Power BI & Tableau Data Visualization Bootcamp",
        "category": "Data Science",
        "skills": ["Power BI", "Tableau", "Data Visualization", "Dashboards"],
        "difficulty": "Beginner",
        "durationHours": 20,
        "format": "video",
        "rating": 4.6,
        "enrollmentCount": 12000,
        "description": "Create stunning executive dashboards, DAX queries, and visual storytelling with Microsoft Power BI."
    },
    {
        "id": "c4",
        "title": "Applied Machine Learning with Scikit-Learn",
        "category": "Machine Learning",
        "skills": ["Python", "Scikit-Learn", "Machine Learning", "Supervised Learning"],
        "difficulty": "Intermediate",
        "durationHours": 32,
        "format": "video",
        "rating": 4.9,
        "enrollmentCount": 31000,
        "description": "Build classification, regression, and clustering pipelines with Scikit-Learn and cross-validation."
    },
    {
        "id": "c5",
        "title": "Deep Learning Specialization with PyTorch",
        "category": "Machine Learning",
        "skills": ["PyTorch", "Deep Learning", "Neural Networks", "CNNs", "Transformers"],
        "difficulty": "Advanced",
        "durationHours": 50,
        "format": "video",
        "rating": 4.9,
        "enrollmentCount": 42000,
        "description": "Master neural networks, backpropagation, convolutional networks and modern transformer architectures."
    },
    {
        "id": "c6",
        "title": "Full Stack React & Node.js Developer Masterclass",
        "category": "Web Development",
        "skills": ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
        "difficulty": "Intermediate",
        "durationHours": 45,
        "format": "video",
        "rating": 4.8,
        "enrollmentCount": 29000,
        "description": "Build end-to-end full stack web applications with React, Express, MongoDB, REST APIs and authentication."
    },
    {
        "id": "c7",
        "title": "Modern JavaScript: From Fundamentals to ESNext",
        "category": "Web Development",
        "skills": ["JavaScript", "HTML", "CSS", "DOM Manipulation"],
        "difficulty": "Beginner",
        "durationHours": 16,
        "format": "interactive",
        "rating": 4.7,
        "enrollmentCount": 35000,
        "description": "Master modern JavaScript syntax, async/await, closures, promises, and browser APIs."
    },
    {
        "id": "c8",
        "title": "Docker, Kubernetes and Cloud DevOps",
        "category": "Cloud & DevOps",
        "skills": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
        "difficulty": "Intermediate",
        "durationHours": 36,
        "format": "video",
        "rating": 4.8,
        "enrollmentCount": 16000,
        "description": "Containerize microservices, build automated GitHub Actions CI/CD pipelines, and deploy onto Kubernetes."
    },
    {
        "id": "c9",
        "title": "Cybersecurity Fundamentals & Ethical Hacking",
        "category": "Cybersecurity",
        "skills": ["Networking", "Linux", "Ethical Hacking", "Security Auditing"],
        "difficulty": "Beginner",
        "durationHours": 28,
        "format": "video",
        "rating": 4.6,
        "enrollmentCount": 14000,
        "description": "Understand vulnerability assessments, penetration testing basics, and enterprise network defense."
    },
    {
        "id": "c10",
        "title": "UI/UX Design Systems and Figma Prototyping",
        "category": "UI/UX Design",
        "skills": ["Figma", "UI Design", "UX Research", "Wireframing", "Design Systems"],
        "difficulty": "Beginner",
        "durationHours": 22,
        "format": "video",
        "rating": 4.7,
        "enrollmentCount": 19000,
        "description": "Create component design systems, conduct user testing, and deliver responsive web and mobile mockups in Figma."
    },
    {
        "id": "c11",
        "title": "Statistics & Probability for Data Science",
        "category": "Data Science",
        "skills": ["Statistics", "Probability", "Hypothesis Testing", "A/B Testing"],
        "difficulty": "Beginner",
        "durationHours": 20,
        "format": "reading",
        "rating": 4.7,
        "enrollmentCount": 15000,
        "description": "Rigorous foundation in statistical tests, probability distributions, sampling, and experimental A/B test design."
    },
    {
        "id": "c12",
        "title": "Next.js 14 and Tailwind CSS Fullstack Architecture",
        "category": "Web Development",
        "skills": ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        "difficulty": "Intermediate",
        "durationHours": 30,
        "format": "video",
        "rating": 4.8,
        "enrollmentCount": 21000,
        "description": "Server Components, App Router, server actions, and modern styling with Tailwind CSS."
    }
]

# Benchmark Learner Profiles with Ground Truth Relevant Course IDs
TEST_PROFILES = [
    {
        "profileId": "user_data_analyst_novice",
        "careerGoal": "Data Analyst",
        "experienceLevel": "Beginner",
        "skills": [{"name": "Excel", "proficiency": 60}],
        "interests": ["Data Analysis", "Business Intelligence", "Spreadsheets"],
        "preferredDuration": "medium",
        "preferredFormat": "video",
        "groundTruth": ["c1", "c2", "c3", "c11"]
    },
    {
        "profileId": "user_frontend_dev",
        "careerGoal": "Full Stack Developer",
        "experienceLevel": "Beginner",
        "skills": [{"name": "HTML", "proficiency": 70}, {"name": "CSS", "proficiency": 60}],
        "interests": ["Web Development", "Frontend", "User Interfaces"],
        "preferredDuration": "medium",
        "preferredFormat": "interactive",
        "groundTruth": ["c7", "c6", "c12"]
    },
    {
        "profileId": "user_ml_engineer",
        "careerGoal": "Machine Learning Engineer",
        "experienceLevel": "Intermediate",
        "skills": [{"name": "Python", "proficiency": 80}, {"name": "Math", "proficiency": 70}],
        "interests": ["Machine Learning", "Neural Networks", "Artificial Intelligence"],
        "preferredDuration": "long",
        "preferredFormat": "video",
        "groundTruth": ["c4", "c5", "c1"]
    },
    {
        "profileId": "user_cloud_devops",
        "careerGoal": "Cloud DevOps Engineer",
        "experienceLevel": "Intermediate",
        "skills": [{"name": "Linux", "proficiency": 75}, {"name": "Bash", "proficiency": 60}],
        "interests": ["Cloud Computing", "Containers", "Automation"],
        "preferredDuration": "medium",
        "preferredFormat": "video",
        "groundTruth": ["c8", "c9"]
    },
    {
        "profileId": "user_ui_ux_designer",
        "careerGoal": "UI/UX Designer",
        "experienceLevel": "Beginner",
        "skills": [{"name": "Graphic Design", "proficiency": 50}],
        "interests": ["Design Systems", "Figma", "User Experience"],
        "preferredDuration": "medium",
        "preferredFormat": "video",
        "groundTruth": ["c10"]
    }
]


def compute_dcg(relevances: List[int], k: int) -> float:
    """Discounted Cumulative Gain at K."""
    dcg = 0.0
    for i in range(min(k, len(relevances))):
        rel = relevances[i]
        dcg += (2**rel - 1) / math.log2(i + 2)
    return dcg


def compute_ndcg(ranked_ids: List[str], ground_truth: List[str], k: int) -> float:
    """Normalized Discounted Cumulative Gain at K."""
    gt_set = set(ground_truth)
    actual_rels = [1 if cid in gt_set else 0 for cid in ranked_ids[:k]]
    actual_dcg = compute_dcg(actual_rels, k)

    # Ideal ranking puts all ground truth hits first
    ideal_rels = sorted(actual_rels, reverse=True)
    ideal_dcg = compute_dcg(ideal_rels, k)

    if ideal_dcg == 0:
        return 0.0
    return actual_dcg / ideal_dcg


def compute_metrics_for_ranking(ranked_ids: List[str], ground_truth: List[str], k_values: List[int]) -> Dict[str, float]:
    gt_set = set(ground_truth)
    metrics = {}

    for k in k_values:
        sub_list = ranked_ids[:k]
        hits = sum(1 for cid in sub_list if cid in gt_set)
        
        # Precision@K
        precision = hits / k if k > 0 else 0.0
        metrics[f"precision@{k}"] = round(precision, 4)

        # Recall@K
        recall = hits / len(gt_set) if len(gt_set) > 0 else 0.0
        metrics[f"recall@{k}"] = round(recall, 4)

        # NDCG@K
        ndcg = compute_ndcg(ranked_ids, ground_truth, k)
        metrics[f"ndcg@{k}"] = round(ndcg, 4)

    # MRR (Mean Reciprocal Rank)
    mrr = 0.0
    for idx, cid in enumerate(ranked_ids):
        if cid in gt_set:
            mrr = 1.0 / (idx + 1)
            break
    metrics["mrr"] = round(mrr, 4)

    # Average Precision (AP)
    ap = 0.0
    running_hits = 0
    for idx, cid in enumerate(ranked_ids):
        if cid in gt_set:
            running_hits += 1
            ap += running_hits / (idx + 1)
    ap = ap / len(gt_set) if gt_set else 0.0
    metrics["map"] = round(ap, 4)

    return metrics


def evaluate_models():
    k_values = [3, 5]
    recommender = HybridCourseRecommender()
    recommender.index_courses(SAMPLE_COURSES)

    results = {
        "hybrid_model": {f"precision@{k}": [] for k in k_values} | {f"recall@{k}": [] for k in k_values} | {f"ndcg@{k}": [] for k in k_values} | {"mrr": [], "map": []},
        "popularity_baseline": {f"precision@{k}": [] for k in k_values} | {f"recall@{k}": [] for k in k_values} | {f"ndcg@{k}": [] for k in k_values} | {"mrr": [], "map": []},
        "random_baseline": {f"precision@{k}": [] for k in k_values} | {f"recall@{k}": [] for k in k_values} | {f"ndcg@{k}": [] for k in k_values} | {"mrr": [], "map": []}
    }

    # Precompute Popularity ranking (sorted by enrollmentCount * rating)
    popularity_ranked = sorted(
        SAMPLE_COURSES,
        key=lambda c: (c.get("enrollmentCount", 0) * c.get("rating", 4.0)),
        reverse=True
    )
    popularity_ids = [str(c["id"]) for c in popularity_ranked]

    all_ids = [str(c["id"]) for c in SAMPLE_COURSES]

    for p in TEST_PROFILES:
        gt = p["groundTruth"]

        # 1. Hybrid Model Ranking
        rec_courses = recommender.recommend(p, SAMPLE_COURSES, top_k=len(SAMPLE_COURSES))
        rec_ids = [str(c["id"]) for c in rec_courses]
        m_hybrid = compute_metrics_for_ranking(rec_ids, gt, k_values)
        for k, v in m_hybrid.items():
            results["hybrid_model"][k].append(v)

        # 2. Popularity Baseline Ranking
        m_pop = compute_metrics_for_ranking(popularity_ids, gt, k_values)
        for k, v in m_pop.items():
            results["popularity_baseline"][k].append(v)

        # 3. Random Baseline Ranking
        random_ids = list(all_ids)
        random.seed(42 + hash(p["profileId"]))
        random.shuffle(random_ids)
        m_rand = compute_metrics_for_ranking(random_ids, gt, k_values)
        for k, v in m_rand.items():
            results["random_baseline"][k].append(v)

    # Average metrics
    aggregated = {}
    for model_name, metrics_dict in results.items():
        aggregated[model_name] = {k: round(float(np.mean(vals)), 4) for k, vals in metrics_dict.items()}

    output = {
        "status": "success",
        "description": "Evaluation of AI Hybrid Model (TF-IDF + Cosine + Skills + Difficulty + Feedback) against Popularity & Random Baselines.",
        "testProfilesCount": len(TEST_PROFILES),
        "totalCatalogSize": len(SAMPLE_COURSES),
        "results": aggregated
    }

    print("==========================================================================================")
    print("      AI-POWERED COURSE RECOMMENDATION SYSTEM — OFFLINE MODEL EVALUATION REPORT           ")
    print("==========================================================================================")
    print(f"{'Metric':<18} | {'Hybrid TF-IDF Model':<22} | {'Popularity Baseline':<20} | {'Random Baseline':<16}")
    print("------------------------------------------------------------------------------------------")
    for metric_key in ["precision@3", "precision@5", "recall@3", "recall@5", "ndcg@3", "ndcg@5", "mrr", "map"]:
        h_val = aggregated["hybrid_model"].get(metric_key, 0.0)
        p_val = aggregated["popularity_baseline"].get(metric_key, 0.0)
        r_val = aggregated["random_baseline"].get(metric_key, 0.0)
        print(f"{metric_key:<18} | {h_val:<22.4f} | {p_val:<20.4f} | {r_val:<16.4f}")
    print("==========================================================================================")
    
    with open("evaluation_results.json", "w") as f:
        json.dump(output, f, indent=2)

    return output


if __name__ == "__main__":
    evaluate_models()
