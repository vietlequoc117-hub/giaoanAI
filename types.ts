export enum GradeLevel {
  GRADE_10 = '10',
  GRADE_11 = '11',
  GRADE_12 = '12',
}

export interface LessonPlanState {
  originalContent: string;
  images: string[]; // Store base64 image strings
  grade: GradeLevel;
  subject: string;
  fileName?: string;
}

export interface AIResponseState {
  markdown: string;
  isLoading: boolean;
  error: string | null;
}