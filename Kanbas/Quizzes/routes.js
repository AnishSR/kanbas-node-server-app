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
            res.status(201).json(updatedQuiz);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });

    // Update question
    app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
        const { quizId, questionId } = req.params;
        const updatedQuestion = req.body;

        try {
            const updatedQuiz = await dao.updateQuestionInQuiz(quizId, questionId, updatedQuestion);
            res.status(200).json(updatedQuiz);
        } catch (error) {
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
}
