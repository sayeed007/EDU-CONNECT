import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  active: {
    required: true,
    default: false,
    type: Boolean,
  },
  slug: {
    required: true,
    type: String,
  },
  course: {
    required: true,
    type: Schema.ObjectId,
  },
  lessonIds: [{ type: Schema.ObjectId, ref: "Lesson" }],
  order: {
    required: true,
    type: Number,
  },
});

export const ModuleData = mongoose.models.Module ?? mongoose.model("Module", moduleSchema);