import { supabase } from '../lib/supabase';

interface ClassMatch {
  courseNumber: string;
  lecture?: string;
  discussion?: string;
}

export interface MatchResult {
  matchPercentage: number;
  matchedClasses: ClassMatch[];
}

const WEIGHTS = {
  SAME_CLASS: 1,
  SAME_LECTURE: 5,
  SAME_DISCUSSION: 2
};

export const calculateMatchPercentage = (userASchedule: any, userBSchedule: any): MatchResult => {
  let totalScore = 0;
  const matchedClasses: ClassMatch[] = [];

  // Get all classes from user A
  const userAClasses = Object.entries(userASchedule).map(([name, details]: [string, any]) => ({
    name,
    courseNumber: details['Course Number'],
    lectures: Object.keys(details).filter(key => key.startsWith('LEC')),
    discussions: Object.keys(details).filter(key => key.startsWith('DIS'))
  }));

  // Calculate max possible score
  const maxScorePerClass = WEIGHTS.SAME_CLASS + WEIGHTS.SAME_LECTURE + WEIGHTS.SAME_DISCUSSION;
  const maxPossibleScore = userAClasses.length * maxScorePerClass;

  // For each class in User A's schedule
  for (const classA of userAClasses) {
    let classMatch: ClassMatch | null = null;

    // Find matching class in User B's schedule
    for (const [nameB, detailsB] of Object.entries(userBSchedule)) {
      if (classA.courseNumber === (detailsB as any)['Course Number']) {
        // Add base score for matching class
        totalScore += WEIGHTS.SAME_CLASS;
        classMatch = { courseNumber: classA.courseNumber };

        // Check for matching lectures
        for (const lecture of classA.lectures) {
          if (Object.keys(detailsB as any).includes(lecture)) {
            const lectureA = userASchedule[classA.name][lecture];
            const lectureB = (detailsB as any)[lecture];
            
            if (arraysEqual(lectureA.Days, lectureB.Days) &&
                lectureA['Start Time'] === lectureB['Start Time'] &&
                lectureA['End Time'] === lectureB['End Time']) {
              totalScore += WEIGHTS.SAME_LECTURE;
              if (classMatch) classMatch.lecture = lecture;
              break;
            }
          }
        }

        // Check for matching discussions
        for (const discussion of classA.discussions) {
          if (Object.keys(detailsB as any).includes(discussion)) {
            const discussionA = userASchedule[classA.name][discussion];
            const discussionB = (detailsB as any)[discussion];
            
            if (arraysEqual(discussionA.Days, discussionB.Days) &&
                discussionA['Start Time'] === discussionB['Start Time'] &&
                discussionA['End Time'] === discussionB['End Time']) {
              totalScore += WEIGHTS.SAME_DISCUSSION;
              if (classMatch) classMatch.discussion = discussion;
              break;
            }
          }
        }

        if (classMatch) {
          matchedClasses.push(classMatch);
        }
        break;
      }
    }
  }

  // Calculate percentage
  const matchPercentage = maxPossibleScore > 0 
    ? Math.round((totalScore / maxPossibleScore) * 100)
    : 0;

  return {
    matchPercentage,
    matchedClasses
  };
};

// Helper function to compare arrays
const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};

export const getMatchWithUser = async (userId: string, otherUserId: string): Promise<MatchResult> => {
  // Fetch both users' calendar data
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('calendar_data')
    .eq('id', userId)
    .single();

  const { data: otherUserData, error: otherUserError } = await supabase
    .from('profiles')
    .select('calendar_data')
    .eq('id', otherUserId)
    .single();

  if (userError || otherUserError) {
    throw new Error('Failed to fetch user data');
  }

  if (!userData?.calendar_data || !otherUserData?.calendar_data) {
    return {
      matchPercentage: 0,
      matchedClasses: []
    };
  }

  return calculateMatchPercentage(userData.calendar_data, otherUserData.calendar_data);
};