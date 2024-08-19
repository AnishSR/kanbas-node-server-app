

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

export const findUserAnswersByQuiz = async (quizId, userId) => {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
        throw new Error("Quiz not found");
    }

    const userAnswers = quiz.scores.find(score => score.studentId === userId);
    return userAnswers || null;
};

export const saveUserAnswers = async (quizId, userId, answers) => {
    console.log("Received answers:", answers);
    let score = 0;

    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
        throw new Error('Quiz not found');
    }


    answers.forEach(answer => {
        console.log("Processing answer:", answer);
        const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
        if (question) {
            if (question.type === "multiple-choice") {

                const correctChoice = question.choices.find(choice => choice.isCorrect);
                if (correctChoice && correctChoice.text === answer.answer) {
                    score += question.points;
                }
            } else if (question.type === "true-false") {

                if (question.isTrue === answer.answer) {
                    score += question.points;
                }
            } else if (question.type === "fill-in-the-blank") {

                const isCorrect = question.correctAnswers.some(correctAns => correctAns.text === answer.answer);
                if (isCorrect) {
                    score += question.points;
                }
            }
        }
    });


    const existingScore = quiz.scores.find(score => score.studentId === userId);

    if (existingScore) {
        await QuizModel.findOneAndUpdate(
            { _id: quizId, "scores.studentId": userId },
            { 
                $set: { 
                    "scores.$.answers": answers, 
                    "scores.$.score": score, 
                    "scores.$.submittedAt": new Date() 
                } 
            },
            { new: true }
        );
    } else {
        const newScoreEntry = {
            studentId: userId,
            score: score,
            answers: answers,
            submittedAt: new Date()
        };
        await QuizModel.findByIdAndUpdate(
            quizId,
            { $push: { scores: newScoreEntry } },
            { new: true }
        );
    }

    return score;
};


// Get student answers
export const getUserAnswers = async (quizId, userId) => {
    const quiz = await QuizModel.findById(quizId);
    const userScore = quiz.scores.find(score => score.studentId === userId);
    return userScore ? userScore.answers : null;
};