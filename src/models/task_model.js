import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type:  String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    beerbonus: {
        type: Number,
        required: true
    },
    wg: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "WG",
        required: true
    }
},
    {
        timestamps: true,
        statics: {
            createTask(WGid ,taskObj) {
                try{
                    taskObj.wg = WGid;
                    return this.create(taskObj);
                }catch(error){
                    throw new Error(error);
                }
            },
            findAllTasksFromWG(WGid) {
                try{
                    return this.find({wg: WGid});
                }catch(error){
                    throw new Error(error);
                }
            },
            findFilterTasksFromWG(WGid ,{title, description}) {
                try{
                    const filter = {};
                    filter.wg = WGid;
                    if(title) filter.title = { $regex: title, $options: 'i' };
                    if(description) filter.description = { $regex: description, $options: 'i' };
                    return this.find(filter);
                }catch(error){
                    throw new Error(error);
                }
            },
            findTaskByID(taskID) {
                try{
                    return this.findById(taskID);
                }catch(error){
                    throw new Error(error);
                }
            },
            updateTask(taskID, updatedData) {
                try{
                    return this.findByIdAndUpdate(
                        taskID,
                        {$set: updatedData},
                        {new: true}
                    );
                }
                catch(error){
                    throw new Error(error);
                }
            },
            deleteTask(taskID) {
                try{
                    return this.deleteOne({_id: taskID});
                }
                catch(error){
                    throw new Error(error);
                }
            }


        }
    });

export default mongoose.model("Task", taskSchema);