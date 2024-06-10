import CourseDetails from "./_components/CourseDetails";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import Testimonials from "./_components/Testimonials";

import { getCourseDetails } from "@/queries/courses";

const SingleCoursePage = async ({ params: { id } }) => {
    const course = await getCourseDetails(id);

    return (
        <>
            <CourseDetailsIntro
                course={course}
            />

            <CourseDetails
                course={course}
            />

            {course?.testimonials?.length > 0 &&
                <Testimonials
                    testimonials={course?.testimonials}
                />
            }

            {/* <RelatedCourses /> */}
        </>
    );
};
export default SingleCoursePage;
