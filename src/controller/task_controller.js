import Task from "../models/task_model.js";
import User from "../models/user_model.js";
import WG from "../models/wg_model.js";
import {ResponseCodes} from "../utils/response_utils.js";

async function getAuthWG(userId, res) {
    const user = await User.findById(userId);
    if(!user){
        res.forbidden();
        return null;
    }
    const wgID = user.wg;
    if(!user.isInWG()) {
        res.forbidden(ResponseCodes.NotInWG);
        return null;
    }else if(!WG.findById(wgID)){
        console.log("wg not found");
        res.notFound(ResponseCodes.WGNotFound);
        return null;
    }
    return wgID;
}

//Controller Funktionen
export async function newTask(req, res) {
    try {
        const task = req.body;
        const wgID = await getAuthWG(req.auth.userId, res);
        if(wgID) {
            const newTask = await Task.createTask(wgID, task);
            console.log("task created");
            res.success({
                id: newTask._id
            });
        }
    }catch(error) {
        console.log("error: "+error);
        res.internalError(error);
    }
}

export async function getAllTasks(req, res) {
    try {
        const wgID = await getAuthWG(req.auth.userId, res);
        if(wgID) {
            const allTasks = await Task.findAllTasksFromWG(wgID);
            console.log("get all tasks from wg: "+wgID);
            res.success({
                tasks: allTasks
            });
        }
    }catch(error) {
        console.log("error: "+error);
        res.internalError(error);
    }
}

export async function getTaskById(req, res) {
        try {
            const taskID = req.params.id;
            const wgID = await getAuthWG(req.auth.userId, res);
            if(wgID) {
                const task = await Task.findTaskByID(taskID);
                if(!task) {
                    return res.notFound();
                }
                const isTaskInUsersWG = task.wg.toString() === wgID.toString();
                if(!isTaskInUsersWG){
                    return res.forbidden();
                }
                res.success({
                    task: task
                });
            }
        }catch(error) {
            console.log("error: "+error);
            res.internalError(error);
        }
}

export async function getFilteredTasks(req, res) {
    try {
        const wgID = await getAuthWG(req.auth.userId, res);
        if(wgID) {
            const filteredTasks = await Task.findFilterTasksFromWG(wgID, req.body);
            console.log("get filtered tasks from wg: "+wgID);
            res.success({
                tasks: filteredTasks
            });
        }
    }catch(error) {
        console.log("error: "+error);
        res.internalError(error);
    }
}

export async function updateTask(req, res) {
    try {
        const taskID = req.params.id;
        const wgID = await getAuthWG(req.auth.userId, res);
        if(wgID) {
            const filteredTasks = await Task.updateTask(taskID, req.body);
            console.log("update task ");
            res.success({
                tasks: filteredTasks
            });
        }
    }catch(error) {
        console.log("error: "+error);
        res.internalError(error);
    }
}

//delete task (check das es gleiche wg ist)
export async function deleteTask(req, res) {
    try {
        const taskID = req.params.id;
        const wgID = await getAuthWG(req.auth.userId, res);
        if(wgID) {
            const task = await Task.findTaskByID(taskID);
            if(!task) {
                res.notFound();
                return;
            }
            const isTaskInUsersWG = task.wg.toString() === wgID.toString();
            if(!isTaskInUsersWG){
                return res.forbidden();
            }
            await Task.deleteTask(req.params.id);
            res.success();
        }
    }catch(error){
        console.log("error: "+error);
        res.internalError(error);
    }
}

//done (del) task & give beers to user
export async function doneTask(req, res) {
    try {
        const taskID = req.params.id;
        const user = await User.findById(req.auth.userId);
        const wgID = await getAuthWG(user.id, res);
        if(wgID) {
            const task = await Task.findTaskByID(taskID);
            if(!task) {
                res.notFound();
                return;
            }
            const isTaskInUsersWG = task.wg.toString() === wgID.toString();
            if(!isTaskInUsersWG){
                return res.forbidden();
            }
            //beertrader für Aufgabe übernehmen
            const beercounter = await user.addBeerbonus(task.beerbonus);
            await Task.deleteTask(req.params.id);
            res.success({
                beercounter: beercounter
            });
        }
    }catch(error){
        console.log("error: "+error);
        res.internalError(error);
    }
}
