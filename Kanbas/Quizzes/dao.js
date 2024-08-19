

import QuizModel from './model.js';

// Create 
export const createQuiz = async (quizData) => {
    try {
        const quiz = new QuizModel(quizData);
        return await quiz.save();
    } catch (error) {
        console.error("Error saving quiz to database:", error);
        throw error;
    }
};

// Find all quizzes by course
export const findQuizzesByCourse = async (courseId) => {
    return await QuizModel.find({ course: courseId });
};

// Find all quizzes 
export const findAllQuizzes = async () => {
    return await QuizModel.find();  
};

// Find quiz
export const findQuizById = async (quizId) => {
    return await QuizModel.findById(quizId);
};

// Update
export const updateQuiz = async (quizId, quizData) => {
    return await QuizModel.findByIdAndUpdate(quizId, quizData, { new: true });
};

// Delete 
export const deleteQuiz = async (quizId) => {
    return await QuizModel.findByIdAndDelete(quizId);
};

export const addQuestionToQuiz = async (quizId, questionData) => {
    return await QuizModel.findByIdAndUpdate(
        quizId, 
        { $push: { questions: questionData } }, 
        { new: true }
    );
};

// Update 
export const updateQuestionInQuiz = async (quizId, questionId, updatedQuestion) => {
    return await QuizModel.findOneAndUpdate(
        { _id: quizId, "questions._id": questionId },
        { $set: { "questions.$": updatedQuestion } },
        { new: true }
    );
};

// Remove 
export const removeQuestionFromQuiz = async (quizId, questionId) => {
    return await QuizModel.findByIdAndUpdate(
        quizId, 
        { $pull: { questions: { _id: questionId } } }, 
        { new: true }
    );
};

