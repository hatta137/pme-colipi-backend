import {Router} from "express";
import { useJWT } from "../utils/jwt_utils.js";
import {
    deleteTask,
    doneTask,
    getAllTasks,
    getFilteredTasks,
    getTaskById,
    newTask, updateTask
} from "../controller/task_controller.js";

const router = Router();

router.post("/",
    useJWT(),
    newTask);

router.get("/",
    useJWT(),
    getAllTasks);

router.get("/filter/:id",
    useJWT(),
    getTaskById);

router.get("/filter",
    useJWT(),
    getFilteredTasks);

router.put("/:id",
    useJWT(),
    updateTask);

router.delete("/:id",
    useJWT(),
    deleteTask);

router.delete("/done/:id",
    useJWT(),
    doneTask);

export default router;