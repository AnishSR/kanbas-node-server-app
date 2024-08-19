import * as dao from "./dao.js"; 

export default function QuizRoutes(app) {
    // Create a new quiz
    app.post("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        const quizData = { ...req.body, course: courseId };
    
        console.log("Received quiz data in backend:", quizData);
    
        try {
            const quiz = await dao.createQuiz(quizData);
            res.status(201).json(quiz);
        } catch (error) {
            console.error("Error creating quiz:", error);  
            res.status(400).json({ message: error.message, errors: error.errors });
        }
    });

    // Get all quizzes by course
    app.get("/api/courses/:courseId/quizzes", async (req, res) => {
        const { courseId } = req.params;
        try {
            const quizzes = await dao.findQuizzesByCourse(courseId);
            res.status(200).json(quizzes);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Get quiz by ID
    app.get("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        try {
            const quiz = await dao.findQuizById(quizId);
            if (quiz) {
                res.status(200).json(quiz);
            } else {
                res.status(404).json({ message: 'Quiz not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Update a quiz
    app.put("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        const quizData = req.body;
        try {
            const quiz = await dao.updateQuiz(quizId, quizData);
            if (quiz) {
                res.status(200).json(quiz);
            } else {
                res.status(404).json({ message: 'Quiz not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Delete quiz by ID
    app.delete("/api/quizzes/:quizId", async (req, res) => {
        const { quizId } = req.params;
        try {
            const quiz = await dao.deleteQuiz(quizId);
            if (quiz) {
                res.status(200).json({ message: 'Quiz deleted successfully' });
            } else {
                res.status(404).json({ message: 'Quiz not found' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // QUESTION FUNCTIONS
    // Create question
    app.post("/api/quizzes/:quizId/questions", async (req, res) => {
        const { quizId } = req.params;
        const questionData = req.body;
    
        try {
            const updatedQuiz = await dao.addQuestionToQuiz(quizId, questionData);
            const newQuestion = updatedQuiz.questions[updatedQuiz.questions.length - 1]; 
            res.status(201).json(newQuestion); 
        } catch (error) {
            console.error('Error adding question:', error);
            res.status(400).json({ message: error.message });
        }
    });

    // Update question
    app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const updatedQuestion = req.body;
    
        try {
            const updatedQuiz = await dao.updateQuestionInQuiz(quizId, questionId, updatedQuestion);
            const updatedQuestionData = updatedQuiz.questions.find(q => q._id.toString() === questionId);
            if (!updatedQuestionData) {
                return res.status(404).json({ message: 'Question not found' });
            }
            res.status(200).json(updatedQuestionData); 
        } catch (error) {
            console.error("Error updating question:", error);
            res.status(400).json({ message: error.message });
        }
    });

    // Remove question
    app.delete("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;

        try {
            const updatedQuiz = await dao.removeQuestionFromQuiz(quizId, questionId);
            res.status(200).json(updatedQuiz);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

  // Save user answers (students and faculty)
  app.post("/api/quizzes/:quizId/answers", async (req, res) => {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    if (!userId || !answers || typeof answers !== 'object') {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        const savedAnswers = await dao.saveUserAnswers(quizId, userId, answers);
        res.status(200).json(savedAnswers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user answers (students and faculty)
app.get("/api/quizzes/:quizId/answers/:userId", async (req, res) => {
    const { quizId, userId } = req.params;

    try {
        const answers = await dao.getUserAnswers(quizId, userId);
        if (!answers) {
            return res.status(404).json({ message: 'No answers found for this user' });
        }
        res.status(200).json(answers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

}
