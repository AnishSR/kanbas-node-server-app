import mongoose from 'mongoose';
import QuizSchema from './schema.js';

const QuizModel = mongoose.model('Quiz', QuizSchema);

export default QuizModel;