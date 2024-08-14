import db from "../Database/index.js";
import * as dao from "./dao.js";
export default function ModuleRoutes(app) {

    app.put("/api/modules/:mid", async (req, res) => {
      const { mid } = req.params;
      const module = req.body;
      res.send(await dao.updateModule(mid, module));
    });

    app.delete("/api/modules/:mid", async (req, res) => {
      const { mid } = req.params;
      res.json(await dao.deleteModule(mid));
    });

    app.post("/api/courses/:cid/modules", async (req, res) => {
        const { cid } = req.params;
        res.json(await dao.createModule({ ...req.body, course: cid }));
      });
    
    app.get("/api/courses/:cid/modules", async (req, res) => {
        const { cid } = req.params;
        res.json(await dao.findModulesByCourse(cid));
    });
}

/*
import db from "../Database/index.js";
export default function ModuleRoutes(app) {

    app.put("/api/modules/:mid", (req, res) => {
      const { mid } = req.params;
      const moduleIndex = db.modules.findIndex(
        (m) => m._id === mid);
      db.modules[moduleIndex] = {
        ...db.modules[moduleIndex],
        ...req.body
      };
      res.sendStatus(204);
    });

    app.delete("/api/modules/:mid", (req, res) => {
      const { mid } = req.params;
      db.modules = db.modules.filter((m) => m._id !== mid);
      res.sendStatus(200);
    });

    app.post("/api/courses/:cid/modules", (req, res) => {
        const { cid } = req.params;
        const newModule = {
          ...req.body,
          course: cid,
          _id: new Date().getTime().toString(),
        };
        db.modules.push(newModule);
        res.send(newModule);
      });
    
    app.get("/api/courses/:cid/modules", (req, res) => {
        const { cid } = req.params;
        const modules = db.modules.filter((m) => m.course === cid);
        res.json(modules);
    });
}
*/