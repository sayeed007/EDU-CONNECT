"use server"

import { Lesson } from "@/model/lesson.model";
import { ModuleData } from "@/model/module.model";
import { create } from "@/queries/lessons";
import mongoose from "mongoose";

export async function createLesson(data) {
  try {
    const title = data.get("title");
    const slug = data.get("slug");
    const moduleId = data.get("moduleId");
    const order = data.get("order");

    const createdLesson = await create({ title, slug, order });

    const moduleDta = await Module.findById(moduleId);
    moduleDta.lessonIds.push(createdLesson._id);
    moduleDta.save();

    return createdLesson;

  } catch (error) {
    throw new Error(error);
  }
}

export async function reOrderLesson(data) {
  try {
    await Promise.all(data.map(async (element) => {
      await Lesson.findByIdAndUpdate(element.id, { order: element.position });
    }));
  } catch (error) {
    throw new Error(error);
  }
};

export async function updateLesson(lessonId, data) {
  try {
    await Lesson.findByIdAndUpdate(lessonId, data);
  } catch (error) {
    throw new Error(error);
  }
};

export async function changeLessonPublishState(lessonId) {
  const lesson = await Lesson.findById(lessonId);
  try {
    const res = await Lesson.findByIdAndUpdate(lessonId, { active: !lesson.active }, { lean: true });
    return res.active
  } catch (error) {
    throw new Error(error);
  }
};

export async function deleteLesson(lessonId, moduleId) {
  try {
    const moduleDta = await Module.findById(moduleId);
    moduleDta.lessonIds.pull(new mongoose.Types.ObjectId(lessonId));
    await Lesson.findByIdAndDelete(lessonId);
    moduleDta.save();
  } catch (error) {
    throw new Error(error);
  }
};
