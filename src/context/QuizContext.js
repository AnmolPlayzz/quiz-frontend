import { createContext, useContext } from 'react';

export const QuizContext = createContext({
  nextQuestion: () => {},
  currentQuestion: () => ({}),
  isCorrect: () => false,
});

export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = QuizContext.Provider;
