import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CourseCurricula from "./CourseCurriculum";
import CourseInstructor from "./CourseInstructor";
import CourseOverview from "./CourseOverview";

import moment from "moment";
import Image from "next/image";
import CourseReviews from "./CourseReviews";

const CourseDetails = ({ course }) => {

    return (
        <section className="py-8 md:py-12 lg:py-24">
            <div className="container">

                {/* CATEGORY NAME */}
                <span className="bg-success py-1 px-2  rounded-full text-xs font-medium inline-block text-white">
                    {course?.category?.title}
                </span>

                {/* COURSE TITLE */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold 2xl:text-5xl mt-3">
                    {course?.title}
                </h3>

                {/* COURSE SUBTITLE */}
                <p className="mt-3 text-gray-600 text-sm">
                    {course?.subtitle}
                </p>

                <div className="flex sm:items-center gap-5 flex-col sm:flex-row sm:gap-6 md:gap-20 mt-6">

                    {/* INSTRUCTOR NAME WITH IMAGE */}
                    <div className="flex items-center gap-2">
                        <Image
                            className="w-[40px] h-[40px] rounded-full"
                            src={course?.instructor?.profilePicture}
                            alt={course?.instructor?.firstName}
                            width={20}
                            height={20}
                        />
                        <p className="font-bold">
                            {course?.instructor?.firstName} {' '} {course?.instructor?.lastName}
                        </p>
                    </div>

                    {/* LAST MODIFIED */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-success font-semibold">
                            Last Updated:{" "}
                        </span>
                        <span>
                            {moment(course?.modifiedOn).format('MMM DD, YYYY')}
                        </span>
                    </div>

                </div>

                {/* Tab */}
                <div className="my-6">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 my-6 max-w-[768px]">

                            <TabsTrigger value="overview">
                                Overview
                            </TabsTrigger>

                            <TabsTrigger value="curriculum">
                                Curriculum
                            </TabsTrigger>

                            <TabsTrigger value="instructor">
                                Instructor
                            </TabsTrigger>

                        </TabsList>

                        {/* each tab content can be independent component */}
                        <TabsContent value="overview">
                            <CourseOverview course={course} />
                        </TabsContent>

                        <TabsContent value="curriculum">
                            <CourseCurricula course={course} />
                        </TabsContent>

                        <TabsContent value="instructor">
                            <CourseInstructor course={course} />
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </section>
    );
};

export default CourseDetails;
