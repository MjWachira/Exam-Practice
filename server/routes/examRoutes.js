const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const excelService = require('../services/excelService');

const router = express.Router();

// Multer storage for Excel file uploads
const uploadDir = path.join(__dirname, '../data/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `uploaded_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
    }
  }
});

// GET QUESTIONS
router.get('/questions', (req, res) => {
  try {
    const { domain, limit, mode } = req.query;
    let questions = excelService.readQuestionsFromExcel();

    // Filter by domain if specified
    if (domain && domain !== 'All') {
      questions = questions.filter(q => q.domain.toLowerCase() === domain.toLowerCase());
    }

    // Shuffle questions if in exam simulation mode
    if (mode === 'simulated') {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    // Limit number of questions if requested
    if (limit && !isNaN(limit)) {
      questions = questions.slice(0, parseInt(limit, 10));
    }

    // Provide questions (omit correct answer if client wants strict untampered exam, or include for client evaluation)
    res.json({
      total: questions.length,
      questions
    });
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to read questions from Excel' });
  }
});

// GET AVAILABLE DOMAINS
router.get('/domains', (req, res) => {
  try {
    const questions = excelService.readQuestionsFromExcel();
    const domainsSet = new Set(questions.map(q => q.domain));
    res.json({
      domains: ['All', ...Array.from(domainsSet)]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load domains' });
  }
});

// DOWNLOAD SAMPLE EXCEL TEMPLATE
router.get('/excel-template', (req, res) => {
  try {
    excelService.ensureDefaultExcelFile();
    res.download(excelService.DEFAULT_EXCEL_PATH, 'csm_questions_template.xlsx');
  } catch (err) {
    res.status(500).json({ error: 'Failed to download template' });
  }
});

// UPLOAD CUSTOM EXCEL QUESTION BANK
router.post('/upload-excel', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadedPath = req.file.path;
    const questions = excelService.readQuestionsFromExcel(uploadedPath);

    if (questions.length === 0) {
      fs.unlinkSync(uploadedPath); // remove invalid file
      return res.status(400).json({ error: 'Uploaded Excel file does not contain valid CSM questions format.' });
    }

    // Replace default Excel with uploaded file
    fs.copyFileSync(uploadedPath, excelService.DEFAULT_EXCEL_PATH);

    res.json({
      message: `Successfully loaded ${questions.length} questions from uploaded Excel file!`,
      questionCount: questions.length,
      sampleQuestions: questions.slice(0, 3)
    });
  } catch (err) {
    console.error('Upload Excel error:', err);
    res.status(500).json({ error: 'Failed to process uploaded Excel file' });
  }
});

module.exports = router;
