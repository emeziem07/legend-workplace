import { defineStore } from 'pinia'
import { ref } from 'vue'

export type QuestionType = 'radio' | 'checkbox' | 'true-false' | 'short-answer' | 'paragraph' | 'dropdown' | 'multiple-choice'

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  required: boolean
  answer?: string | string[]
}

export interface SurveySection {
  id: string
  title: string
  questions: Question[]
}

export interface Survey {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  sections: SurveySection[]
  submittedAt?: string
}

export const useFeedbackStore = defineStore('feedback', () => {
  const surveys = ref<Survey[]>([
    {
      id: 'sv1',
      title: 'Q3 Employee Engagement Survey',
      description: 'Help us understand how you\'re feeling about your work environment, team dynamics, and overall satisfaction at the company.',
      dueDate: 'Jul 20, 2025',
      status: 'Not Started',
      sections: [
        {
          id: 's1',
          title: 'Work Environment',
          questions: [
            { id: 'q1', type: 'radio', text: 'How satisfied are you with your current work environment?', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
            { id: 'q2', type: 'radio', text: 'Do you have the tools and resources needed to do your job effectively?', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'], required: true },
            { id: 'q3', type: 'true-false', text: 'My workspace is conducive to productivity.', required: true },
          ],
        },
        {
          id: 's2',
          title: 'Team & Management',
          questions: [
            { id: 'q4', type: 'radio', text: 'How would you rate communication from your direct manager?', options: ['Excellent', 'Good', 'Fair', 'Poor'], required: true },
            { id: 'q5', type: 'checkbox', text: 'Which of the following best describes your team dynamics? (Select all that apply)', options: ['Collaborative', 'Supportive', 'Goal-oriented', 'Innovative', 'Siloed', 'Competitive'], required: false },
            { id: 'q6', type: 'paragraph', text: 'What could your manager do differently to better support your growth?', required: false },
          ],
        },
        {
          id: 's3',
          title: 'Professional Growth',
          questions: [
            { id: 'q7', type: 'dropdown', text: 'How many professional development opportunities have you taken advantage of this quarter?', options: ['None', '1–2', '3–5', 'More than 5'], required: true },
            { id: 'q8', type: 'multiple-choice', text: 'Which development areas would you like more support in?', options: ['Leadership Skills', 'Technical Skills', 'Communication', 'Project Management', 'Industry Knowledge', 'Data & Analytics'], required: false },
            { id: 'q9', type: 'short-answer', text: 'What is one career goal you\'d like to work toward in the next 6 months?', required: false },
          ],
        },
        {
          id: 's4',
          title: 'Overall Satisfaction',
          questions: [
            { id: 'q10', type: 'radio', text: 'On a scale from 1–5, how likely are you to recommend this company as a great place to work?', options: ['1 – Not at all likely', '2 – Unlikely', '3 – Neutral', '4 – Likely', '5 – Extremely likely'], required: true },
            { id: 'q11', type: 'true-false', text: 'I feel valued and recognized for my contributions.', required: true },
            { id: 'q12', type: 'paragraph', text: 'Please share any additional comments, suggestions, or feedback you\'d like to provide to leadership.', required: false },
          ],
        },
      ],
    },
    {
      id: 'sv2',
      title: 'Workplace Safety & Wellness Assessment',
      description: 'A quarterly assessment to ensure all employees feel safe, healthy, and supported in their workplace.',
      dueDate: 'Jul 25, 2025',
      status: 'Completed',
      submittedAt: 'Jul 5, 2025',
      sections: [
        {
          id: 's5',
          title: 'Safety',
          questions: [
            { id: 'q13', type: 'true-false', text: 'I am aware of the company\'s emergency procedures.', required: true, answer: 'True' },
            { id: 'q14', type: 'radio', text: 'How safe do you feel at work?', options: ['Very Safe', 'Safe', 'Somewhat Safe', 'Unsafe'], required: true, answer: 'Very Safe' },
          ],
        },
      ],
    },
    {
      id: 'sv3',
      title: 'Training Effectiveness Feedback',
      description: 'We\'d like to know how effective our recent training programs have been for your professional development.',
      dueDate: 'Jul 30, 2025',
      status: 'In Progress',
      sections: [
        {
          id: 's6',
          title: 'Training Evaluation',
          questions: [
            { id: 'q15', type: 'dropdown', text: 'Which training did you attend most recently?', options: ['Leadership Excellence', 'Data Analytics Fundamentals', 'Customer Service Excellence', 'Risk & Compliance'], required: true, answer: 'Data Analytics Fundamentals' },
            { id: 'q16', type: 'radio', text: 'How would you rate the overall quality of the training?', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
          ],
        },
      ],
    },
  ])

  const submitSurvey = (surveyId: string) => {
    const survey = surveys.value.find(s => s.id === surveyId)
    if (survey) {
      survey.status = 'Completed'
      survey.submittedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const updateAnswer = (surveyId: string, questionId: string, answer: string | string[]) => {
    const survey = surveys.value.find(s => s.id === surveyId)
    if (!survey) return
    for (const section of survey.sections) {
      const q = section.questions.find(q => q.id === questionId)
      if (q) { q.answer = answer; break }
    }
    if (survey.status === 'Not Started') survey.status = 'In Progress'
  }

  return { surveys, submitSurvey, updateAnswer }
})
