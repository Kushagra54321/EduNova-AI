const mongoose = require('mongoose');

const phaseSchema = mongoose.Schema({
  day: { type: String, required: true },
  title: { type: String, required: true },
  tasks: [{ type: String, required: true }]
});

const studyPlanSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    examDate: {
      type: Date,
      required: true,
    },
    topicsCovered: {
      type: String,
      required: true,
    },
    plan: [phaseSchema]
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);
module.exports = StudyPlan;
