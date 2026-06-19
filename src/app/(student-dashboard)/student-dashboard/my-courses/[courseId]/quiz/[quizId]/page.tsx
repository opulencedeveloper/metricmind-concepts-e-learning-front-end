'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useHttp } from '@/hooks/useHttp';
import { useQuizTimer } from '@/hooks/useQuizTimer';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, AlertType, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { QuestionType } from '@/enums/question';
import { ChevronLeft, Clock } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz timer - separate hook to prevent full page re-renders
  const timer = useQuizTimer(quiz?.timeLimit || null);

  useEffect(() => {
    if (courseId && quizId) {
      fetchQuiz();
    }
  }, [courseId, quizId]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timer.isTimeUp && !isSubmitting && Object.keys(answers).length > 0) {
      handleSubmit();
    }
  }, [timer.isTimeUp]);

  const fetchQuiz = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/${courseId}/quiz/${quizId}`,
        isAuth: true,
      },
      successRes: (data: any) => {
        setQuiz(data.quiz || data);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message || 'Failed to load quiz');
      },
    });
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check all questions are answered
    if (Object.keys(answers).length !== quiz.questions?.length) {
      setError('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);

    // Calculate time taken in seconds
    const timeTaken = quiz.timeLimit
      ? quiz.timeLimit * 60 - (timer.remainingTime || 0)
      : 0;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/student/courses/${courseId}/quiz/${quizId}/submit`,
        body: { quizId, answers, timeTaken },
        isAuth: true,
      },
      successRes: (data: any) => {
        router.push(`/student-dashboard/my-courses/${courseId}/quiz/${quizId}/results?attemptId=${data.attemptId}`);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to submit quiz');
        setIsSubmitting(false);
        // Smooth scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  if (isLoading && !quiz) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !quiz) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchQuiz} />;
  }

  if (!quiz) {
    return null;
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* Header - Sticky */}
      <motion.div
        className="sticky top-15 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6 mb-4">
            {/* Back Button */}
            <Link
              href={`/student-dashboard/my-courses/${courseId}/learn`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>

            {/* Quiz Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{quiz.title}</h1>
            </div>

            {/* Timer */}
            {quiz.timeLimit && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-semibold transition-colors ${
                timer.remainingTime !== null && timer.remainingTime < 300
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <Clock className="w-4 h-4" />
                {timer.formattedTime}
              </div>
            )}
          </div>

          {/* Progress Bar - Sticky Below Header */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="origin-left"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500">Progress</p>
              <p className="text-xs font-semibold text-gray-600">{answeredCount} of {totalQuestions}</p>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="h-full bg-gray-900 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
        {error && <Alert type={AlertType.Error} message={error} dismissible />}

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions?.map((question: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-5 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Question {idx + 1}
                      </span>
                      {answers[idx.toString()] && (
                        <span className="text-xs font-semibold text-green-600">✓ Answered</span>
                      )}
                    </div>
                    <p className="text-base text-gray-500 font-medium">
                      {question.questionType === QuestionType.MultipleChoice && 'Multiple Choice'}
                      {question.questionType === QuestionType.TrueFalse && 'True/False'}
                    </p>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-xl font-semibold text-gray-900 mb-6 leading-relaxed">
                  {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {question.options?.map((option: string, optIdx: number) => {
                    const isSelected = answers[idx.toString()] === String(optIdx);
                    return (
                      <motion.label
                        key={optIdx}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer border transition-all ${
                          isSelected
                            ? 'border-gray-900 bg-gray-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={idx.toString()}
                          value={String(optIdx)}
                          checked={isSelected}
                          onChange={(e) => handleAnswerChange(idx.toString(), e.target.value)}
                          className="w-5 h-5 mt-0.5 accent-gray-900"
                        />
                        <span className={`text-base font-medium leading-relaxed ${
                          isSelected ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                      </motion.label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar - Fixed */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 backdrop-blur-sm"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Link href={`/student-dashboard/my-courses/${courseId}/learn`} className="flex-1">
              <Button
                fullWidth
                variant={ButtonVariant.Secondary}
                className="h-12 font-medium"
              >
                Cancel
              </Button>
            </Link>
            <Button
              fullWidth
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < totalQuestions || timer.isTimeUp}
              isLoading={isSubmitting}
              className="h-12 font-medium"
            >
              {isSubmitting ? 'Submitting...' : `Submit (${answeredCount}/${totalQuestions})`}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
