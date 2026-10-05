const axios = require('axios');
const db = require('../db/datastore');

class AssistantService {
  async processMessage(user, messageText, history = []) {
    const text = (messageText || '').toLowerCase().trim();
    const courses = await db.Course.find();
    const careers = await db.Career.find();

    const userGoal = user.careerGoal || 'Data Analyst';
    const userSkills = (user.currentSkills || []).map(s => typeof s === 'object' ? s.name : s);

    // Check optional external LLM API
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const catalogSummary = courses.map(c => `- ${c.title} (${c.category}, ${c.difficulty}, ${c.durationHours}h): Skills: ${c.skills.join(', ')}`).join('\n');
        const systemPrompt = `You are an expert AI Learning Advisor for the AI Course Recommendation Platform.
Student Profile:
- Name: ${user.name}
- Career Goal: ${userGoal}
- Current Skills: ${userSkills.join(', ') || 'None specified'}
- Experience Level: ${user.experienceLevel || 'Beginner'}

Available Courses in Catalog (DO NOT INVENT ANY COURSES NOT IN THIS LIST):
${catalogSummary}

Provide an encouraging, practical, and highly structured response. Only mention courses from the list above.`;

        const resp = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${messageText}` }] }
            ]
          },
          { timeout: 4000 }
        );

        const aiReply = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiReply) {
          const suggestions = this._findMatchingCourses(messageText, courses);
          return { content: aiReply, courseSuggestions: suggestions };
        }
      } catch (e) {
        // Fallback to grounded knowledge assistant
      }
    }

    // Grounded Knowledge Engine
    return this._ruleBasedGroundedAssistant(text, user, courses, careers);
  }

  _findMatchingCourses(query, courses) {
    const q = query.toLowerCase();
    return courses.filter(c => {
      const inTitle = c.title.toLowerCase().includes(q);
      const inCat = c.category.toLowerCase().includes(q);
      const inSkills = (c.skills || []).some(s => q.includes(s.toLowerCase()) || s.toLowerCase().includes(q));
      return inTitle || inCat || inSkills;
    }).slice(0, 3).map(c => ({
      id: c._id || c.id,
      title: c.title,
      difficulty: c.difficulty,
      provider: c.provider,
      rating: c.rating
    }));
  }

  _ruleBasedGroundedAssistant(query, user, courses, careers) {
    const userGoal = user.careerGoal || 'Data Analyst';
    const userSkills = (user.currentSkills || []).map(s => typeof s === 'object' ? s.name.toLowerCase() : s.toLowerCase());
    const exp = user.experienceLevel || 'Beginner';

    // 1. Study Plan query
    if (query.includes('study plan') || query.includes('hours') || query.includes('schedule') || query.includes('time')) {
      const weeklyHours = user.weeklyGoalHours || 10;
      const relevant = courses.filter(c => c.category.toLowerCase().includes(userGoal.toLowerCase().split(' ')[0]) || (c.skills || []).some(s => s.toLowerCase().includes('sql') || s.toLowerCase().includes('python')));
      const top3 = relevant.slice(0, 3);
      const totalHours = top3.reduce((sum, c) => sum + (c.durationHours || 20), 0);
      const estimatedWeeks = Math.ceil(totalHours / weeklyHours);

      const content = `Here is your customized **${weeklyHours}-Hour Weekly Study Plan** for **${userGoal}**:\n\n` +
        `• **Pacing**: Dedicating **${weeklyHours} hours per week** will allow you to complete your core foundational track in approximately **${estimatedWeeks} weeks**.\n` +
        `• **Recommended Daily Rhythm**: 1.5 hours on weekdays (theory + coding practice), 2.5 hours on Saturday (capstone project building).\n\n` +
        `**Sequential Focus:**\n` +
        top3.map((c, i) => `${i + 1}. **${c.title}** (~${c.durationHours} hrs) — Focus on ${c.skills.slice(0, 3).join(', ')}`).join('\n') +
        `\n\nI have attached the exact catalog courses below so you can add them directly to your learning dashboard!`;

      return {
        content,
        courseSuggestions: top3.map(c => ({ id: c._id || c.id, title: c.title, difficulty: c.difficulty, provider: c.provider, rating: c.rating }))
      };
    }

    // 2. Prerequisites query
    if (query.includes('prereq') || query.includes('requirement') || query.includes('before')) {
      let matchedCourse = courses.find(c => query.includes(c.title.toLowerCase()) || (c.skills || []).some(s => query.includes(s.toLowerCase())));
      if (!matchedCourse) matchedCourse = courses[0];

      const prereqs = (matchedCourse.prerequisites && matchedCourse.prerequisites.length > 0)
        ? matchedCourse.prerequisites.join(', ')
        : 'Basic computer literacy and enthusiasm to learn';

      const content = `For **${matchedCourse.title}**, the expected prerequisites and background knowledge are:\n\n` +
        `• **Official Prerequisites**: ${prereqs}\n` +
        `• **Recommended Level**: ${matchedCourse.difficulty}\n` +
        `• **Key Skills Taught**: ${matchedCourse.skills.join(', ')}\n\n` +
        `If you are just getting started, our system has placed beginner-friendly courses in your roadmap before moving to this course.`;

      return {
        content,
        courseSuggestions: [{ id: matchedCourse._id || matchedCourse.id, title: matchedCourse.title, difficulty: matchedCourse.difficulty, provider: matchedCourse.provider, rating: matchedCourse.rating }]
      };
    }

    // 3. Career advice or "What should I learn next"
    if (query.includes('next') || query.includes('learn') || query.includes('become') || query.includes('career') || query.includes('start')) {
      const career = careers.find(c => query.includes(c.title.toLowerCase())) || careers.find(c => c.title.toLowerCase() === userGoal.toLowerCase()) || careers[0];
      const required = (career.requiredSkills || []).map(s => s.name);
      const missing = required.filter(r => !userSkills.some(us => us.includes(r.toLowerCase()) || r.toLowerCase().includes(us)));

      const nextSkill = missing[0] || required[0] || 'Core Technologies';
      const gapCourses = courses.filter(c => (c.skills || []).some(s => s.toLowerCase().includes(nextSkill.toLowerCase()))).slice(0, 3);

      const content = `Based on your profile for **${career.title}** and experience level (**${exp}**):\n\n` +
        `1. **Current Milestone**: You are strengthening foundational competencies.\n` +
        `2. **Critical Next Skill to Learn**: **${nextSkill}** (This is a primary skill gap for ${career.title}).\n` +
        `3. **Why this matters**: Industry benchmarks show ${career.title} roles require at least 80% proficiency in ${required.slice(0, 4).join(', ')}.\n` +
        `4. **Recommended Next Course**: We recommend starting with **${gapCourses[0]?.title || 'our foundational course'}** below!`;

      return {
        content,
        courseSuggestions: gapCourses.map(c => ({ id: c._id || c.id, title: c.title, difficulty: c.difficulty, provider: c.provider, rating: c.rating }))
      };
    }

    // General fallback
    const recommended = courses.slice(0, 3);
    const content = `Hello ${user.name}! I am your AI Learning Advisor.\n\n` +
      `I can help you with:\n` +
      `• Identifying skill gaps for **${userGoal}** or other tech careers.\n` +
      `• Explaining course prerequisites and difficulty levels.\n` +
      `• Creating a personalized weekly study plan based on your available hours.\n` +
      `• Recommending verified courses directly from our catalog.\n\n` +
      `What topic, skill, or learning objective would you like to explore today?`;

    return {
      content,
      courseSuggestions: recommended.map(c => ({ id: c._id || c.id, title: c.title, difficulty: c.difficulty, provider: c.provider, rating: c.rating }))
    };
  }
}

module.exports = new AssistantService();
