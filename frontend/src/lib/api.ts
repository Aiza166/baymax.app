/**
 * api.ts - Backend API client utilities
 * Centralizes all API calls to the Baymax backend
 *
 * In development : VITE_API_URL is empty → Vite proxy forwards to :8000
 * In production  : VITE_API_URL = https://baymax-backend.onrender.com
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface PipelineResponse {
  resume_analysis: string;
  interview_report: string;
  job_matches: string;
  career_roadmap: string;
}

export interface ExtractResponse {
  success: boolean;
  filename: string;
  extracted_text: string;
  character_count: number;
}

export interface HealthResponse {
  status: string;
  api_keys_configured: boolean;
  debug_mode: boolean;
}

/**
 * Check if the backend API is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error("Baymax is starting up. Please try again in a moment.");
  return response.json();
}

/**
 * Extract text from a resume PDF
 */
export async function extractResume(file: File): Promise<ExtractResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/extract-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not read this PDF in demo mode. Try another PDF or paste your resume text.");
  }

  return response.json();
}

/**
 * Run the full pipeline analysis
 */
export async function runPipeline(
  resumeText: string,
  jobTitle: string,
  candidateAnswers: string = "",
): Promise<PipelineResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_title: jobTitle,
      candidate_answers: candidateAnswers,
    }),
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not complete the full demo pipeline right now. You can still explore each stage manually.");
  }

  return response.json();
}

/**
 * Analyze resume only (step 1)
 */
export async function analyzeResume(
  resumeText: string,
  jobTitle: string,
): Promise<{ analysis: string }> {
  const formData = new FormData();
  formData.append("resume_text", resumeText);
  formData.append("job_title", jobTitle);

  const response = await fetch(`${API_BASE_URL}/resume-analysis`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not analyze the resume right now. Please try again or continue with the sample flow.");
  }

  return response.json();
}

/**
 * Generate interview questions (step 2)
 */
export async function generateInterview(
  jobTitle: string,
  resumeSummary: string,
): Promise<{ interview: string }> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("resume_summary", resumeSummary);

  const response = await fetch(`${API_BASE_URL}/interview`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not generate interview questions right now. Please try again in a moment.");
  }

  return response.json();
}

/**
 * Search for matching jobs (step 3)
 */
export async function searchJobs(
  jobTitle: string,
  skillsSummary: string,
): Promise<{ jobs: string }> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("skills_summary", skillsSummary);

  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not load job matches right now. Please try again or continue to the roadmap stage.");
  }

  return response.json();
}

export interface RoadmapResponse {
  roadmap: string;
}

export async function generateRoadmap(
  jobTitle: string,
  skillsGap: string,
): Promise<RoadmapResponse> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("skills_gap", skillsGap);

  const response = await fetch(`${API_BASE_URL}/roadmap`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not generate the roadmap right now. Please try again, or use the sample 90-day plan as a guide.");
  }

  return response.json();
}

// ── Multi-turn Interview Session API ─────────────────────────────────────────

export interface InterviewStartResponse {
  session_id: string;
  question: string;
}

export interface InterviewReplyResponse {
  feedback: string;
  score: number;
  next_question: string;
  is_done: boolean;
}

/**
 * Start a new multi-turn interview session with Sam.
 * Returns the first question and a session_id.
 */
export async function startInterview(
  jobTitle: string,
  resumeSummary: string = "",
): Promise<InterviewStartResponse> {
  const response = await fetch(`${API_BASE_URL}/interview/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_title: jobTitle, resume_summary: resumeSummary }),
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not start the interview coach right now. Please try again in a moment.");
  }

  return response.json();
}

/**
 * Submit an answer for the current interview question.
 * Returns feedback, score, the next question, and whether the interview is done.
 */
export async function replyInterview(
  sessionId: string,
  answer: string,
  questionNum: number,
): Promise<InterviewReplyResponse> {
  const response = await fetch(`${API_BASE_URL}/interview/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      answer,
      question_num: questionNum,
    }),
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not submit that answer right now. Your demo progress is still safe.");
  }

  return response.json();
}

/**
 * Transcribe voice audio via Groq Whisper on the backend.
 * Accepts any audio blob from the browser's MediaRecorder.
 */
export async function transcribeAudio(
  audioBlob: Blob,
): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  const response = await fetch(`${API_BASE_URL}/interview/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not transcribe the audio. You can type your answer instead.");
  }

  return response.json();
}

// ── Structured Resume Analysis (NEW) ─────────────────────────────────────────

export interface ResumeImprovement {
  section: string;
  before: string;
  after: string;
  why: string;
}

export interface ResumeAnalysisStructured {
  overall_score: number;
  ats_score: number;
  keyword_match_score: number;
  impact_score: number;
  formatting_score: number;
  verdict: "Excellent" | "Good" | "Needs Improvement";
  strengths: string[];
  skill_gaps: string[];
  keywords_found: string[];
  keywords_missing: string[];
  improvements: ResumeImprovement[];
  rewritten_summary: string;
  recommendation: string;
}

/**
 * Upload a PDF resume and get a fully structured JSON analysis back.
 * Returns 5 scores, keyword clouds, strengths, gaps, improvements, and
 * a rewritten professional summary.
 */
export async function analyzeResumeStructured(
  file: File,
  jobTitle: string,
  experienceLevel: string = "0-1",
): Promise<ResumeAnalysisStructured> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_title", jobTitle);
  formData.append("experience_level", experienceLevel);

  const response = await fetch(`${API_BASE_URL}/resume/analyze-structured`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not run the detailed ATS analysis right now. Please try again or use the sample result.");
  }

  return response.json();
}

/**
 * Enhance an existing resume section using AI.
 * Returns improved content with strong action verbs, metrics, and ATS keywords.
 */
export async function improveResumeSection(
  sectionName: string,
  content: string,
  jobTitle: string,
): Promise<{ improved_content: string }> {
  const response = await fetch(`${API_BASE_URL}/resume/improve-section`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      section_name: sectionName,
      content,
      job_title: jobTitle,
    }),
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not improve this section right now. Your original text is still safe.");
  }

  return response.json();
}

/**
 * Generate a brand-new resume section from minimal context using AI.
 * Returns polished, ATS-optimized content ready to paste.
 */
export async function generateResumeSection(
  sectionName: string,
  context: string,
  jobTitle: string,
): Promise<{ generated_content: string }> {
  const response = await fetch(`${API_BASE_URL}/resume/generate-section`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      section_name: sectionName,
      context,
      job_title: jobTitle,
    }),
  });

  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not generate this section right now. Try adding a little more context.");
  }

  return response.json();
}

// ── New session-aware API helpers ─────────────────────────────────────────────

export interface Certification {
  name: string;
  issuer: string;
  platform: string;
  url: string;
  duration: string;
  cost: string;
  addresses: string;
  why_relevant: string;
}

/**
 * Search jobs — sends the full structured skills list for personalised results.
 */
export async function searchJobsWithSkills(
  jobTitle: string,
  skillsSummary: string,
  skillsList: string[],
  userId: string,
): Promise<{ jobs: string }> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("skills_summary", skillsSummary);
  formData.append("skills_list", skillsList.join(","));
  formData.append("user_id", userId);

  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not load job matches right now. Please try again or continue to the roadmap stage.");
  }
  return response.json();
}

/**
 * Generate a hyper-personalised roadmap using all pipeline context.
 */
export async function generateRoadmapFull(
  jobTitle: string,
  skillsGap: string,
  currentSkills: string,
  interviewWeakAreas: string,
): Promise<{ roadmap: string }> {
  const formData = new FormData();
  formData.append("job_title", jobTitle);
  formData.append("skills_gap", skillsGap);
  formData.append("current_skills", currentSkills);
  formData.append("interview_weak_areas", interviewWeakAreas);

  const response = await fetch(`${API_BASE_URL}/roadmap`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not generate the roadmap right now. Please try again, or use the sample 90-day plan as a guide.");
  }
  return response.json();
}

/**
 * Persist the user's full resume + analysis to Mem0 after analysis completes.
 */
export async function saveUserProfile(
  userId: string,
  resumeText: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysisResult: Record<string, any>,
  jobTitle: string,
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/resume/save-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      resume_text: resumeText,
      analysis_result: analysisResult,
      job_title: jobTitle,
    }),
  });
  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not save the profile for this demo session, but you can continue using the dashboard.");
  }
  return response.json();
}

/**
 * Persist mock interview results for the Roadmap agent.
 */
export async function saveInterviewResult(
  userId: string,
  avgScore: number,
  weakAreas: string,
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/interview/save-result`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, avg_score: avgScore, weak_areas: weakAreas }),
  });
  if (!response.ok) return { success: false };
  return response.json();
}

/**
 * Get AI-recommended certifications based on the user's specific skill gaps.
 */
export async function getCertifications(
  jobTitle: string,
  skillsGap: string[],
  currentSkills: string[],
): Promise<{ certifications: Certification[] }> {
  const response = await fetch(`${API_BASE_URL}/roadmap/certifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_title: jobTitle, skills_gap: skillsGap, current_skills: currentSkills }),
  });
  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax could not load certifications right now. The roadmap can still be reviewed.");
  }
  return response.json();
}

// ── Rahul Interactive Chat ────────────────────────────────────────────────────

export interface RahulChatResponse {
  reply: string;
  show_aid: boolean;
  resources: Array<{ title: string; url: string; platform: string; duration: string; free: boolean; financial_aid?: boolean }>;
  aid_course: string;
  aid_template?: string;
}

/**
 * Send a follow-up message to Rahul (career mentor) and get a response.
 */
export async function chatWithRahul(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  jobTitle: string,
  skillsGap: string,
): Promise<RahulChatResponse> {
  const response = await fetch(`${API_BASE_URL}/roadmap/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_message: userMessage,
      conversation_history: conversationHistory,
      job_title: jobTitle,
      skills_gap: skillsGap,
    }),
  });
  if (!response.ok) {
    await response.json().catch(() => ({}));
    throw new Error("Baymax chat is temporarily unavailable. Please continue with the roadmap tasks and try again later.");
  }
  return response.json();
}

