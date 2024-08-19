import mongoose from 'mongoose';

// Schema for multiple-choice options
const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});

// Schema for fill-in-the-blank correct answers
const FillInTheBlankAnswerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
});

// Schema for individual questions
const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'], required: true },
    questionText: { type: String, required: true },
    points: { type: Number, required: true },
    choices: [OptionSchema],  
    isTrue: { type: Boolean }, 
    correctAnswers: [FillInTheBlankAnswerSchema],  
});

const ScoreSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    score: { type: Number, required: true },
    answers: [{
        questionId: { type: String, required: true },
        answer: { type: mongoose.Schema.Types.Mixed, required: true },  
        isCorrect: { type: Boolean } 
    }],
    submittedAt: { type: Date, default: Date.now }
});
// Main Quiz schema
const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    quizType: { type: String, enum: ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey'], required: true },
    assignmentGroup: { type: String, enum: ['Quizzes', 'Exams', 'Assignments', 'Project'], required: true },
    shuffleAnswers: { type: Boolean, default: false },
    timeLimit: { type: Boolean, default: false },
    timeLimitEntry: { type: Number, default: 0 }, 
    allowMultipleAttempts: { type: Boolean, default: false },
    attemptLimit: { type: Number, default: 1 },
    showCorrectedAnswers: { type: Boolean, default: false },
    accessCode: { type: Boolean, default: false },
    accessCodeEntry: { type: String, default: '' },
    oneQuestionAtATime: { type: Boolean, default: false },
    webCamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    description: { type: String },
    points: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    availableFrom: { type: Date, required: true },
    availableUntil: { type: Date, required: true },
    published: { type: Boolean, default: false },
    questions: [QuestionSchema],  
    scores: [ScoreSchema]
}, { collection: "quizzes" });

export default QuizSchema;
