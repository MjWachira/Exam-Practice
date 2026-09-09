const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { users: [], sessions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error loading DB file, resetting:', err);
    const initialData = { users: [], sessions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// User operations
function findUserByEmail(email) {
  const db = loadDB();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  const db = loadDB();
  return db.users.find(u => u.id === id);
}

function createUser(user) {
  const db = loadDB();
  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: user.name,
    email: user.email.toLowerCase(),
    password: user.password, // expected to be already hashed
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

// Session operations
function saveSession(sessionData) {
  const db = loadDB();
  const newSession = {
    id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    ...sessionData,
    timestamp: new Date().toISOString()
  };
  db.sessions.unshift(newSession); // newest first
  saveDB(db);
  return newSession;
}

function getUserSessions(userId) {
  const db = loadDB();
  return db.sessions.filter(s => s.userId === userId);
}

function getSessionById(sessionId) {
  const db = loadDB();
  return db.sessions.find(s => s.id === sessionId);
}

function getUserAnalytics(userId) {
  const sessions = getUserSessions(userId);
  if (sessions.length === 0) {
    return {
      totalAttempts: 0,
      passedAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      totalTimeSpentSeconds: 0,
      domainBreakdown: {},
      recentSessions: []
    };
  }

  const passedAttempts = sessions.filter(s => s.passed).length;
  const totalScore = sessions.reduce((acc, s) => acc + s.scorePercentage, 0);
  const highestScore = Math.max(...sessions.map(s => s.scorePercentage));
  const totalTimeSpentSeconds = sessions.reduce((acc, s) => acc + (s.timeTakenSeconds || 0), 0);

  // Aggregate domain statistics across all user sessions
  const domainStats = {};
  sessions.forEach(session => {
    if (session.domainBreakdown) {
      Object.entries(session.domainBreakdown).forEach(([domain, stats]) => {
        if (!domainStats[domain]) {
          domainStats[domain] = { total: 0, correct: 0 };
        }
        domainStats[domain].total += stats.total || 0;
        domainStats[domain].correct += stats.correct || 0;
      });
    }
  });

  const domainBreakdown = {};
  Object.entries(domainStats).forEach(([domain, stats]) => {
    domainBreakdown[domain] = {
      total: stats.total,
      correct: stats.correct,
      percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    };
  });

  return {
    totalAttempts: sessions.length,
    passedAttempts,
    passRate: Math.round((passedAttempts / sessions.length) * 100),
    averageScore: Math.round(totalScore / sessions.length),
    highestScore,
    totalTimeSpentSeconds,
    domainBreakdown,
    recentSessions: sessions.slice(0, 5)
  };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  saveSession,
  getUserSessions,
  getSessionById,
  getUserAnalytics
};
