import { Lesson } from "@/model/lesson.model";
import { replaceMongoIdInObject } from "@/lib/convertData";


// GET SPECIFIC LESSON BY LESSON ID
export async function getLesson(lessonId) {
    const lesson = await Lesson
        .findById(lessonId)
        .lean();

    return replaceMongoIdInObject(lesson);
};

export async function create(lessonData) {
    try {
        const lesson = await Lesson.create(lessonData);
        return JSON.parse(JSON.stringify(lesson));
    } catch (error) {
        throw new Error(error);
    }
};

export async function getLessonBySlug(slug) {
    try {
        const lesson = await Lesson.findOne({ slug: slug }).lean();
        return replaceMongoIdInObject(lesson);
    } catch (error) {
        throw new Error(error);
    }
};