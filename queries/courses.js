import { Course } from "@/model/course-model";
import { Category } from "@/model/category-model";
import { User } from "@/model/user-model";
import { Testimonial } from "@/model/testimonial-model";
import { ModuleData } from "@/model/module.model";
import { Lesson } from "@/model/lesson.model";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";

import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";

import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";


// Custom groupBy function
function groupBy(array, keyFn) {
    return array.reduce((result, item) => {
        const key = keyFn(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
        return result;
    }, {});
};


// GET ALL ACTIVE COURSE LIST WITH LINKED(CATEGORY, INSTRUCTOR, TESTIMONIAL, MODULES) DATA
export async function getCourseList() {
    const courses = await Course
        .find({ active: true })
        .sort({ modifiedOn: -1 }) // Sort by modifiedOn field in descending order
        .limit(10) // Limit the results to the latest 10 courses
        .select(["title", "subtitle", "thumbnail", "modules", "price", "category", "instructor"])
        .populate({
            path: "category",
            model: Category
        })
        .populate({
            path: "instructor",
            model: User
        })
        .populate({
            path: "testimonials",
            model: Testimonial
        })
        .populate({
            path: "modules",
            model: ModuleData
        })
        .lean();

    return replaceMongoIdInArray(courses);
};


// GET SPECIFIC COURSE DETAILS BY ID
export async function getCourseDetails(id) {
    const course = await Course
        .findById(id)
        .populate({
            path: "category",
            model: Category
        })
        .populate({
            path: "instructor",
            model: User
        })
        .populate({
            path: "testimonials",
            model: Testimonial,
            populate: {
                path: "user",
                model: User
            }
        })
        .populate({
            path: "modules",
            model: ModuleData,
            populate: {
                path: "lessonIds",
                model: Lesson
            }
        })
        .populate({
            path: "quizSet",
            model: Quizset,
            populate: {
                path: "quizIds",
                model: Quiz
            }
        })
        .lean();

    return replaceMongoIdInObject(course)
};


// GET COURSE DETAILS BY INSTRUCTOR ID
export async function getCourseDetailsByInstructor(instructorId, expand) {

    // Step 1: Fetch Published Courses
    const publishedCourses = await Course
        .find({ instructor: instructorId, active: true })
        .lean();

    // Step 2: Fetch Enrollments - By Published Courses
    const enrollments = await Promise.all(
        publishedCourses.map(async (course) => {
            const enrollment = await getEnrollmentsForCourse(course._id.toString());
            return enrollment;
        })
    );

    // Step 3: Group Enrollments by Course
    const groupedByCourses = groupBy(enrollments?.flat(), ({ course }) => course);

    // Step 4: Calculate Total Revenue
    const totalRevenue = publishedCourses.reduce((acc, course) => {
        const quantity = groupedByCourses[course._id] ? groupedByCourses[course._id].length : 0;
        return (acc + quantity * course.price)
    }, 0);

    // Step 5: Calculate Total Enrollments
    const totalEnrollments = enrollments.reduce(function (acc, obj) {
        return acc + obj.length;
    }, 0)

    // Step 6: Fetch Testimonials
    const testimonials = await Promise.all(
        publishedCourses.map(async (course) => {
            const testimonial = await getTestimonialsForCourse(course._id.toString());
            return testimonial;
        })
    );

    // Step 7: Calculate Average Rating
    const totalTestimonials = testimonials.flat();
    const avgRating = (totalTestimonials.reduce(function (acc, obj) {
        return acc + obj.rating;
    }, 0)) / totalTestimonials.length;


    // Step 8: Return Results
    if (expand) {
        const allCourses = await Course.find({ instructor: instructorId }).lean();
        return {
            "courses": allCourses?.flat(),
            "enrollments": enrollments?.flat(),
            "reviews": totalTestimonials,
        }
    };

    return {
        "courses": publishedCourses.length,
        "enrollments": totalEnrollments,
        "reviews": totalTestimonials.length,
        "ratings": avgRating.toPrecision(2),
        "revenue": totalRevenue
    };
}

export async function create(courseData) {
    try {
        const course = await Course.create(courseData);
        return JSON.parse(JSON.stringify(course));
    } catch (error) {
        throw new Error(error);
    }
};