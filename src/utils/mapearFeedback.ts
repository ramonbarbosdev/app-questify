import { AttemptStatus } from "../components/AttemptIndicator";

export const mapearFeedback = (feedback: any): AttemptStatus => {
  if (!feedback) return 'wrong';

  if (typeof feedback === 'string') {
    if (feedback === 'CORRETO') return 'correct';
    if (feedback === 'ALTO' || feedback === 'BAIXO') return 'close';
    return 'wrong';
  }

  if (Array.isArray(feedback)) {
    if (feedback.every(f => f === 'CORRETA')) return 'correct';
    if (feedback.some(f => f === 'CORRETA' || f === 'FECHADA')) return 'close';
    return 'wrong';
  }

  return 'wrong';
};