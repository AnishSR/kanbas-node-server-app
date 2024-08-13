import Database from "../Database/index.js";
import * as dao from "./dao.js";
export default function CourseRoutes(app) {
    app.put("/api/courses/:id", async (req, res) => {
        const { id } = req.params;
        const course = req.body;
        await dao.updateCourse(id, course);
        res.sendStatus(204);
      });
    
    app.delete("/api/courses/:id", async (req, res) => {
        const { id } = req.params;
        await dao.deleteCourse(id);
        res.sendStatus(204);
      });
    
    app.post("/api/courses", async (req, res) => {
        const course = { ...req.body,
            _id: new Date().getTime().toString() };
        await dao.createCourse(course);
        res.send(course);
        });
      
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses)
    });
}
