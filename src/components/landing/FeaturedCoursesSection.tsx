import { ArrowRight, Star, Users, Clock } from "lucide-react";
import appConfig from "@/lib/config";
import FeaturedCoursesContent from "./FeaturedCoursesContent";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  currency: string;
  level: string;
  rating: number;
  studentsEnrolled: number;
  totalDuration: number;
  thumbnail?: string;
}

async function getCourses() {
  try {
    const response = await fetch(
      `${appConfig.api.baseURL}/student/courses/featured`,
      {
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) throw new Error("Failed to fetch courses");
    const data = await response.json();
    return data.data.courses || [];
  } catch (error) {
    console.log("Error fetching featured courses:", error);
    return [];
  }
}

export default async function FeaturedCoursesSection() {
  const courses = await getCourses();
  const featuredCourses = courses || [];

  if (featuredCourses.length === 0) {
    return null;
  }
  console.log("FeaturedCourses", featuredCourses);
  return <FeaturedCoursesContent courses={featuredCourses} />;
}
