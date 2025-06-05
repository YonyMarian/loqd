/**
 * 
 * example single class:
 * {
 * ...,
 * "Software Construction": {
 *   "Course Number": "CS 35L",
 *   "LEC 1": {
 *     "Instructor": "Eggert, P.R.",
 *     "Location": "Franz Hall 1178",
 *     "Days": [ "TU", "TH"],
 *     "Start Time": "4:00 PM",
 *     "End Time": "5:50 PM",
 *    },
 *   "DIS 1B": {
 *     "Instructor": "Wan, E.",
 *     "Location": "Dodd Hall 146",
 *     "Days": [ "F" ],
 *     "Start Time": "10:00 AM",
 *     "End Time": "11:50 AM",
 *    },
 *   "Final Exam": "06/06/2025",
 *   
 * }
 * ...,
 * }
 */

// throws error if we get an event that doesn't have at least these specified fields
export type WellFormedEvent = {
    description: string,
    location: string,
    start: string,
    end: string,
    summary: string
    [key: string]: unknown
}

type Schedule = {
    [fullName: string]: {
        'Final Exam'?: string;
        [key: string]: unknown;
    }
}

export default function getScheduleObject(cal: Array<WellFormedEvent>): Object {
    const schedule: Schedule = {};
    const finalExams: Array<{ finalDescription: string, finalDate: string }> = []
    for (const event of cal) {
        // first get class full name
        const fullNameStart = event["description"].indexOf("\n") + 1;
        const fullNameEnd = event["description"].indexOf("\n", fullNameStart);
        const fullName = event["description"].substring(
            fullNameStart,
            fullNameEnd === -1 ? event["description"].length : fullNameEnd
        ); // class full name

        const summary = parseSummary(event["summary"]);
        if (summary) {
            // final exams are uniquely annoying in that their VEVENT objects only have the
            // course number, not the full name--but store the course number along WITH
            // the classInstance type. For now, we unfortunately store finals for later
            // and deal with them later
            if (summary["courseNum"].toLowerCase().includes("final exam")) {
                // get date of final exam
                const finalDate = new Date(event["start"]);
                const year = finalDate.getFullYear();
                const month = (finalDate.getMonth() + 1).toString().padStart(2, "0");
                const day = finalDate.getDate().toString().padStart(2, "0");
                finalExams.push(
                    {
                        finalDescription: summary["courseNum"].substring(12).toUpperCase(),
                        finalDate: `${month}/${day}/${year}`
                    }
                )
                // console.log(`Added ${finalExams[finalExams.length - 1].finalDescription} to finals array`)
            }
            // this branch handles "regular" class instances like lectures or discussions
            else {
                // simplifies dealing with key errors later
                if (!schedule[fullName]) {
                    schedule[fullName] = {}
                }
                const classInstance = summary["classInstance"];
                const courseNum = summary["courseNum"];
                const instructor = event["description"].substring(fullNameEnd + 1); // class instance instructor
                const location = event["location"]; // class instance location
                const startTime = formatTime(event["start"])["time"]; // start time (Pacific)
                const endTime = formatTime(event["end"])["time"]; // end time (Pacific)
                const days = event["byday"]
                // here we add the specific class instance
                if (!schedule[fullName]["Course Number"]) {
                    schedule[fullName]["Course Number"] = courseNum
                }
                schedule[fullName][classInstance] = {
                    "Instructor": instructor,
                    "Location": location,
                    "Days": days,
                    "Start Time": startTime,
                    "End Time": endTime,
                }
            }
        }
    }
    // we can now check to see if we have already found the final exam for this class
    for (const course of Object.keys(schedule)) {
        for (const exam of finalExams) {
            if (exam.finalDescription.includes(schedule[course]["Course Number"] as string)) {
                schedule[course]["Final Exam"] = exam.finalDate;
            }
        }
    }
    return schedule
}

const typeCodes = {
    "ACT": "Activity",
    "CLI": "Clinic",
    "DIS": "Discussion",
    "FLD": "Fieldwork", 
    "LAB": "Laboratory",
    "LEC": "Lecture",
    "REC": "Recitation",
    "RGP": "Research Group",
    "SEM": "Seminar",
    "STU": "Studio",
    "TUT": "Tutorial",
}
const parseSummary = (summary: string): { courseNum: string, classInstance: string } | null => {
    /*
    * Parse the summary of a calendar event to extract the class name, type, and location.
    * Returns a JSON object of the form:
    * {
    *   "courseNum": "<abbreviated class name>", e.g. "CS 35L"
    *   "classInstance": "<portion of class enrollment>", e.g. "LEC 1"
    * }
    */
    try {
        const retObj = {}
        const parts = summary.split(" ");
        for (let i = 0; i < parts.length; i++) {
            // look for type code first, careful that "DIS" for discussion is not "DIS" for Disability Studies
            if (Object.keys(typeCodes).includes(parts[i]) && i + 1 < parts.length && parts[i + 1] !== "STD") {
                return {
                    "courseNum": parts.slice(0, i).join(" "),
                    "classInstance": parts.slice(i, i + 2).join(" ")
                }
            }
        }
    }
    catch (e) {
        console.error("Error parsing summary: ", e);
        return null;
    }
    return null;
}

const formatTime = (timeStr: string): { day: string, time: string } => {
  const rawTime = new Date(timeStr);
  return {
    day:  rawTime.toLocaleDateString("en-US", {
            timeZone: "America/Los_Angeles",
            weekday:  "long"
          }),
    time: rawTime.toLocaleTimeString("en-US", {
            timeZone:   "America/Los_Angeles",
            hour:       "numeric",
            minute:     "2-digit",
            hour12:     true
          })
  };
}

function toWellFormedEvent(event: any): WellFormedEvent | null {
    // Check that all required fields exist
    if (
        typeof event.description === 'string' &&
        typeof event.location === 'string' &&
        event.start &&
        event.end &&
        typeof event.summary === 'string'
    ) {
        return {
            description: event.description,
            location: event.location,
            start: event.start.toString(), // or format as needed
            end: event.end.toString(),
            summary: event.summary,
            ...event // include any extra fields if needed
        };
    }
    return null; // or throw an error if you want strictness
}



// module.exports = {
//     getScheduleObject,
//     //WellFormedEvent,
//     toWellFormedEvent
// };

export {getScheduleObject, toWellFormedEvent};