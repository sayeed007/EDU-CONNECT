import { replaceMongoIdInObject } from "@/lib/convertData";
import { ModuleData } from "@/model/module.model";
import { Lesson } from "@/model/lesson.model";

export async function create(moduleData) {
    try {
        const moduleData = await Module.create(moduleData);
        return JSON.parse(JSON.stringify(module));
    } catch (e) {
        throw new Error(e)
    }
}

export async function getModule(moduleId) {
    try {
        const moduleData = await Module.findById(moduleId).
            populate({
                path: "lessonIds",
                model: Lesson
            }).
            lean();
        return replaceMongoIdInObject(module);
    } catch (e) {
        throw new Error(e)
    }
}

export async function getModuleBySlug(moduleSlug) {
    try {
        const moduleData = await Module.findOne({ slug: moduleSlug }).lean();
        return replaceMongoIdInObject(module);
    } catch (error) {
        throw new Error(error);
    }
}