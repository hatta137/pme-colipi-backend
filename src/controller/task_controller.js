import Task from "../models/task_model.js";
import User from "../models/user_model.js";
import WG from "../models/wg_model.js";
import {ResponseCodes} from "../utils/response_utils.js";

async function getAuthWG(userId, res) {
    const user = await User.findById(userId);
    if(!user){
        res.notFound(ResponseCodes.NotFound, "User from JWT not found");
        return null;
    }
    const wgID = user.wg;
    if(!user.isInWG()) {
        res.forbidden(ResponseCodes.NotInWG);
        return null;
    }else if(!WG.findById(wgID)){
        console.log("wg not found");
        res.notFound(ResponseCodes.WGNotFound, {wg: wgID});
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
            res.success(newTask);
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
            res.success(allTasks);
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
                    res.notFound(ResponseCodes.NotFound, "Task not found");
                    return;
                }
                if(task.wg.toString() !== wgID.toString()){ // ist der task aus users wg?
                    res.forbidden(ResponseCodes.Forbidden, "Task not from Users WG. You cannot see foreign Tasks");
                    return;
                }
                res.success(task);
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
            res.success(filteredTasks);
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
            res.success(filteredTasks);
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
                res.notFound(ResponseCodes.NotFound, "Task not found");
                return;
            }
            if(task.wg.toString() !== wgID.toString()){ // ist der task aus users wg?
                res.forbidden(ResponseCodes.Forbidden, "Task not from Users WG. You cannot delete foreign Tasks");
                return;
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
                res.notFound(ResponseCodes.NotFound, "Task not found");
                return;
            }
            if(task.wg.toString() !== wgID.toString()){ // ist der task aus users wg?
                res.forbidden(ResponseCodes.Forbidden, "Task not from Users WG. You cannot check foreign Tasks as done");
                return;
            }
            //beertrader für Aufgabe übernehmen
            const beercounter = await user.addBeerbonus(task.beerbonus);
            await Task.deleteTask(req.params.id);
            res.success({beercounter: beercounter});
        }
    }catch(error){
        console.log("error: "+error);
        res.internalError(error);
    }
}



