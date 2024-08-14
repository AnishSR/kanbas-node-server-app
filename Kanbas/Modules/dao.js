import model from "./model.js";
import mongoose from 'mongoose';

export const createModule = (module) => {
    return model.create(module);
}  

export const findAllModules = () => {return model.find();}
export const findModuleById = (moduleId) => {return model.findOne({_id: moduleId});}


export const updateModule = (moduleId, module) => {
    const result = model.updateOne({ _id: moduleId }, { $set: module });
    return result;
};
export const deleteModule = async (moduleId) => {
    return model.deleteOne({ _id: moduleId });
    

};
export const findModulesByCourse = (courseId) =>{return model.find({course: courseId});}

