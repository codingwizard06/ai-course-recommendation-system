const assert = require('assert');
const db = require('../src/db/datastore');
const mlClient = require('../src/services/mlClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../src/middleware/auth');

async function runTestSuite() {
  console.log('--- Starting Automated Backend Test Suite ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error(`    ${e.message}`);
      failed++;
    }
  }

  await test('Database initialization and seeding', async () => {
    await db.initDatabase();
    const courses = await db.Course.find();
    assert(courses.length >= 20, `Expected at least 20 courses, found ${courses.length}`);
  });

  await test('User authentication and password hashing', async () => {
    const student = await db.User.findOne({ email: 'student@example.com' });
    assert(student, 'Demo student should exist');
    const isMatch = await bcrypt.compare('password123', student.password);
    assert(isMatch, 'Password should match hashed value');

    const token = jwt.sign({ id: student._id || student.id, email: student.email, role: student.role }, JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    assert.strictEqual(decoded.email, 'student@example.com');
  });

  await test('Course search and filtering', async () => {
    const allCourses = await db.Course.find();
    const sqlCourses = allCourses.filter(c => c.skills && c.skills.includes('SQL'));
    assert(sqlCourses.length >= 1, 'Should find at least 1 course teaching SQL');
  });

  await test('ML Client recommendations and scoring formula', async () => {
    const student = await db.User.findOne({ email: 'student@example.com' });
    const courses = await db.Course.find();
    const res = await mlClient.getRecommendations({
      profile: student,
      courses,
      feedback: [],
      targetCareerSkills: ['Python', 'SQL', 'Excel', 'Power BI'],
      topK: 5
    });
    assert(res.recommendations.length > 0, 'Should return recommendations');
    const first = res.recommendations[0];
    assert(first.matchScore > 0, 'Match score should be > 0');
    assert(first.scoreDetails.finalScore > 0, 'Final score should be > 0');
    assert(first.recommendationReason, 'Should provide explainable AI reason');
  });

  await test('Skill gap analysis calculation', async () => {
    const userSkills = [{ name: 'Python', proficiency: 60 }, { name: 'Excel', proficiency: 75 }];
    const requiredSkills = [
      { name: 'Python', importance: 'essential' },
      { name: 'SQL', importance: 'essential' },
      { name: 'Power BI', importance: 'important' }
    ];
    const courses = await db.Course.find();
    const res = await mlClient.getSkillGap({
      userSkills,
      careerTitle: 'Data Analyst',
      requiredSkills,
      courses
    });
    assert.strictEqual(res.data.totalRequiredSkills, 3);
    assert(res.data.missingSkills.length >= 1, 'Should identify missing skills like SQL or Power BI');
    assert(res.data.overallMatchPercentage > 0, 'Overall match % should be > 0');
  });

  await test('Enrollment creation and progress updates', async () => {
    const student = await db.User.findOne({ email: 'student@example.com' });
    const userId = String(student._id || student.id);
    const enrollment = await db.Enrollment.create({
      userId,
      courseId: 'course_web_01',
      status: 'in_progress',
      progressPercentage: 25,
      hoursSpent: 4
    });
    assert.strictEqual(enrollment.progressPercentage, 25);

    const updated = await db.Enrollment.findByIdAndUpdate(
      enrollment._id || enrollment.id,
      { progressPercentage: 100, status: 'completed' },
      { new: true }
    );
    assert.strictEqual(updated.status, 'completed');
  });

  console.log('---------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTestSuite().catch(e => {
  console.error(e);
  process.exit(1);
});
