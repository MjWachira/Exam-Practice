const express = require('express');
const cors = require('cors');
const path = require('path');
const { router: authRouter } = require('./routes/authRoutes');
const examRouter = require('./routes/examRoutes');
const sessionRouter = require('./routes/sessionRoutes');
const excelService = require('./services/excelService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure default Excel file is generated on startup
excelService.ensureDefaultExcelFile();

// Register API Routes
app.use('/api/auth', authRouter);
app.use('/api/exam', examRouter);
app.use('/api/sessions', sessionRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'CSM Exam Practice Backend API',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 CSM Practice Exam Server running on port ${PORT}`);
  console.log(`📊 Reading Excel questions from: ${excelService.DEFAULT_EXCEL_PATH}`);
  console.log(`====================================================`);
});
