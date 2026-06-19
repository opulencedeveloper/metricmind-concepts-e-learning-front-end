export interface EnrolledCourse {
  _id: string;
  title: string;
  instructor: string;
  progress: number;
  thumbnail: string;
  previewVideoUrl: string;
  courseId: {
    _id: string;
  };
}

export interface EnrolledCourseCardProps {
  course: EnrolledCourse;
  index?: number;
}
