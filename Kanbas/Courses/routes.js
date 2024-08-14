import Database from "../Database/index.js";
import * as dao from "./dao.js";
export default function CourseRoutes(app) {
    //console.log("CourseRoutes loaded");
    app.put("/api/courses/:id", async (req, res) => {
        //console.log("Received request to update course:", req.body)
        const { id } = req.params;
        const course = req.body;
        await dao.updateCourse(id, course);
        res.sendStatus(204);
      });
    
      app.delete("/api/courses/:id", async (req, res) => {
        const { id } = req.params;

        const result = await dao.deleteCourse(id);
        
        res.sendStatus(204); 
    
    });
    
      app.post("/api/courses", async (req, res) => {
        //console.log("Received request to create course:", req.body);
        const course = req.body;  
        delete course._id;
        const createdCourse = await dao.createCourse(course);
        //console.log("Course created:", createdCourse);
        res.status(201).send(createdCourse);  
       
    });
      
    app.get("/api/courses", async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses)
    });
}
