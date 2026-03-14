const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { chat, generateNotes, generatePlan, getPlans, generateQuiz, submitQuiz, getAnalytics } = require('../controllers/aiController');
const { generateSmartStudy } = require('../controllers/smartStudyController');
const { protect } = require('../middleware/authMiddleware');

// AI Routes
router.post('/chat', protect, chat);
router.post('/chat', protect, chat);
router.post('/notes', protect, generateNotes);
router.post('/planner', protect, generatePlan);
router.get('/planner', protect, getPlans);
router.post('/quiz/generate', protect, generateQuiz);
router.post('/quiz/submit', protect, submitQuiz);
router.get('/analytics', protect, getAnalytics);

// Smart Study Mode (File Uploads)
router.post('/smart-study', protect, upload.single('file'), generateSmartStudy);

module.exports = router;
