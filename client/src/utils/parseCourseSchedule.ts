import * as fs from 'fs';

type CourseSession = {
  day: string;
  stime: string;
  etime: string;
  num: string;
  title: string;
  location: string;
  instructor: string;
};


export function parseCourseSchedule(data: Record<string, any>): CourseSession[] {
  const result: CourseSession[] = [];

  for (const [courseTitle, courseDetails] of Object.entries(data)) {
    const course = courseDetails as Record<string, any>;
    const courseNumber = course["Course Number"];

    for (const [sessionName, sessionDetails] of Object.entries(course)) {
      if (sessionName === "Course Number") continue;

      const days = sessionDetails["Days"] as string[];
      const stime = sessionDetails["Start Time"];
      const etime = sessionDetails["End Time"];
      const location = sessionDetails["Location"];
      const instructor = sessionDetails["Instructor"];

      for (const day of days) {
        result.push({
          day,
          stime,
          etime,
          num: courseNumber,
          title: courseNumber + " " + sessionName,
          location,
          instructor,
        });
      }
    }
  }

  return result;
}
