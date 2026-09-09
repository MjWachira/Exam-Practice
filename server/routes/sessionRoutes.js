const express = require('express');
const db = require('../services/dbService');
const excelService = require('../services/excelService');
const { authenticateToken } = require('./authRoutes');

const router = express.Router();

// SUBMIT EXAM SESSION & GRADE
router.post('/submit', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const { mode, selectedDomain, userAnswers, timeTakenSeconds } = req.body;

    if (!userAnswers || typeof userAnswers !== 'object') {
      return res.status(400).json({ error: 'User answers payload is required' });
    }

    // Load full official questions bank from Excel to grade accurately
    const questions = excelService.readQuestionsFromExcel();
    const questionMap = new Map(questions.map(q => [q.id, q]));

    let correctCount = 0;
    let totalQuestionsEvaluated = 0;
    const gradedAnswers = [];
    const domainBreakdownRaw = {};

    // Evaluate submitted answers
    Object.entries(userAnswers).forEach(([qIdStr, selectedOpt]) => {
      const qId = parseInt(qIdStr, 10);
      const questionObj = questionMap.get(qId);

      if (questionObj) {
        totalQuestionsEvaluated++;
        const isCorrect = selectedOpt && selectedOpt.toUpperCase() === questionObj.correctAnswer.toUpperCase();
        if (isCorrect) correctCount++;

        // Track domain stats
        const domain = questionObj.domain || 'General Scrum';
        if (!domainBreakdownRaw[domain]) {
          domainBreakdownRaw[domain] = { total: 0, correct: 0 };
        }
        domainBreakdownRaw[domain].total++;
        if (isCorrect) domainBreakdownRaw[domain].correct++;

        gradedAnswers.push({
          questionId: questionObj.id,
          question: questionObj.question,
          options: questionObj.options,
          correctAnswer: questionObj.correctAnswer,
          selectedOption: selectedOpt || 'Unanswered',
          isCorrect,
          explanation: questionObj.explanation,
          domain: questionObj.domain
        });
      }
    });

    if (totalQuestionsEvaluated === 0) {
      return res.status(400).json({ error: 'No valid questions were submitted for evaluation.' });
    }

    const scorePercentage = Math.round((correctCount / totalQuestionsEvaluated) * 100);
    // Standard Scrum Alliance CSM passing score is 74%
    const PASSING_THRESHOLD = 74;
    const passed = scorePercentage >= PASSING_THRESHOLD;

    // Calculate domain percentages
    const domainBreakdown = {};
    Object.entries(domainBreakdownRaw).forEach(([domain, stats]) => {
      domainBreakdown[domain] = {
        total: stats.total,
        correct: stats.correct,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      };
    });

    const sessionPayload = {
      userId,
      userName,
      mode: mode || 'practice',
      selectedDomain: selectedDomain || 'All',
      totalQuestions: totalQuestionsEvaluated,
      correctAnswers: correctCount,
      scorePercentage,
      passed,
      timeTakenSeconds: timeTakenSeconds || 0,
      domainBreakdown,
      answers: gradedAnswers
    };

    // Save session in persistent DB
    const savedSession = db.saveSession(sessionPayload);

    res.status(201).json({
      message: 'Exam submitted and graded successfully',
      session: savedSession
    });
  } catch (err) {
    console.error('Submit exam session error:', err);
    res.status(500).json({ error: 'Failed to submit and grade exam session' });
  }
});

// GET USER SESSIONS HISTORY
router.get('/my-sessions', authenticateToken, (req, res) => {
  try {
    const sessions = db.getUserSessions(req.user.id);
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user session history' });
  }
});

// GET SINGLE SESSION AUDIT DETAILS
router.get('/detail/:sessionId', authenticateToken, (req, res) => {
  try {
    const session = db.getSessionById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session detail' });
  }
});

// GET USER ANALYTICS DASHBOARD STATS
router.get('/analytics', authenticateToken, (req, res) => {
  try {
    const analytics = db.getUserAnalytics(req.user.id);
    res.json({ analytics });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

module.exports = router;
