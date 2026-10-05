"""
app.py
Flask Microservice for Course Recommendation & ML Analytics.
Runs on port 5001.
"""

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import HybridCourseRecommender

app = Flask(__name__)
CORS(app)

recommender = HybridCourseRecommender()

# Load cached evaluation results if available
EVAL_RESULTS_PATH = os.path.join(os.path.dirname(__file__), "evaluation_results.json")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "AI Course Recommendation ML Engine",
        "version": "1.0.0",
        "indexedCoursesCount": len(recommender.courses),
        "model": "Hybrid TF-IDF + Cosine Similarity + Skill Match + Difficulty + Interaction Feedback"
    }), 200


@app.route("/recommend", methods=["POST"])
def recommend_courses():
    try:
        data = request.get_json(force=True) or {}
        profile = data.get("profile", {})
        courses = data.get("courses", [])
        feedback_list = data.get("feedback", [])
        target_career_skills = data.get("targetCareerSkills", [])
        top_k = int(data.get("topK", 10))
        exclude_completed_ids = data.get("excludeCompletedIds", [])

        if not courses and not recommender.courses:
            return jsonify({
                "status": "error",
                "message": "No courses provided or indexed"
            }), 400

        recommendations = recommender.recommend(
            profile=profile,
            courses=courses if courses else None,
            feedback_list=feedback_list,
            target_career_skills=target_career_skills,
            top_k=top_k,
            exclude_completed_ids=exclude_completed_ids
        )

        return jsonify({
            "status": "success",
            "count": len(recommendations),
            "recommendations": recommendations
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/skill-gap", methods=["POST"])
def calculate_skill_gap():
    try:
        data = request.get_json(force=True) or {}
        user_skills = data.get("userSkills", [])
        career_title = data.get("careerTitle", "Target Career")
        required_skills = data.get("requiredSkills", [])
        courses = data.get("courses", [])

        gap_analysis = recommender.analyze_skill_gap(
            user_skills=user_skills,
            career_title=career_title,
            required_skills=required_skills,
            courses=courses if courses else None
        )

        return jsonify({
            "status": "success",
            "data": gap_analysis
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/roadmap", methods=["POST"])
def generate_roadmap():
    try:
        data = request.get_json(force=True) or {}
        career_goal = data.get("careerGoal", "General Tech")
        profile = data.get("profile", {})
        courses = data.get("courses", [])

        roadmap = recommender.generate_roadmap(
            career_goal=career_goal,
            profile=profile,
            courses=courses if courses else None
        )

        return jsonify({
            "status": "success",
            "roadmap": roadmap
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/metrics", methods=["GET"])
def get_metrics():
    if os.path.exists(EVAL_RESULTS_PATH):
        with open(EVAL_RESULTS_PATH, "r") as f:
            data = json.load(f)
        return jsonify(data), 200
    else:
        # Run live evaluation if not cached
        from evaluate_model import evaluate_models
        data = evaluate_models()
        return jsonify(data), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"ML Recommendation Microservice starting on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
