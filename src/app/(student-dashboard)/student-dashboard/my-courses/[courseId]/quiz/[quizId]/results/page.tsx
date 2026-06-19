'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useHttp } from '@/hooks/useHttp';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { ChevronLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

function QuizResultsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;
  const attemptId = searchParams.get('attemptId');
  const { isLoading, sendHttpRequest } = useHttp();

  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (courseId && quizId && attemptId) {
      fetchResults();
    }
  }, [courseId, quizId, attemptId]);

  const fetchResults = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/quiz/${quizId}/results/${attemptId}`,
        isAuth: true,
      },
      successRes: (data: any) => {
        // Map submission data to results format
        const submission = data.submission || data;
        const quiz = submission.quiz || data.quiz;
        const reviewAnswers = data.reviewAnswers || [];

        // Count correct answers by comparing with quiz answers
        let correctCount = 0;
        if (submission.answers && quiz?.questions) {
          submission.answers.forEach((answer: any) => {
            const question = quiz.questions[answer.questionIndex];
            if (question && (answer.selectedAnswer === question.correctAnswer ||
                           answer.selectedAnswer === String(question.correctAnswer))) {
              correctCount++;
            }
          });
        }

        setResults({
          score: submission.percentageScore,
          maxScore: submission.maxScore,
          passingScore: quiz?.passingScore || 60,
          correctAnswers: correctCount,
          totalQuestions: quiz?.questions?.length || 0,
          passed: submission.passed,
          timeTaken: submission.timeTaken,
          attemptNumber: submission.attemptNumber,
          reviewAnswers: reviewAnswers,
        });
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message || 'Failed to load results');
        // Smooth scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  if (isLoading && !results) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !results) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchResults} />;
  }

  if (!results) {
    return null;
  }

  const passed = results.score >= (results.passingScore || 70);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <motion.div
        className="sticky top-15 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href={`/student-dashboard/my-courses/${courseId}/learn`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
        {/* Result Hero - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            {passed ? (
              <CheckCircle2 className="w-20 h-20 text-green-600 mx-auto" />
            ) : (
              <AlertCircle className="w-20 h-20 text-gray-900 mx-auto" />
            )}
          </motion.div>

          {/* Result Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {passed ? '🎉 Congratulations!' : '📝 Quiz Completed'}
            </h1>
            <p className="text-xl text-gray-600">
              {passed
                ? 'You successfully passed the quiz!'
                : 'You did not pass this time. Review and try again!'}
            </p>
          </motion.div>
        </motion.div>

        {/* Score Card - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-8"
        >
          <div className="grid grid-cols-2 gap-8">
            {/* Your Score */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm font-medium text-gray-500 mb-2">Your Score</p>
              <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={passed ? '#16a34a' : '#6b7280'}
                    strokeWidth="8"
                    strokeDasharray={`${Math.min((results.score / results.passingScore) * 339.3, 339.3)} 339.3`}
                    initial={{ strokeDasharray: '0 339.3' }}
                    animate={{ strokeDasharray: `${Math.min((results.score / results.passingScore) * 339.3, 339.3)} 339.3` }}
                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className={`text-3xl font-bold ${passed ? 'text-green-600' : 'text-gray-900'}`}
                  >
                    {results.score}%
                  </motion.span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">vs. Passing Score ({results.passingScore}%)</p>
            </div>

            {/* Stats */}
            <div className="space-y-6 flex flex-col justify-center">
              {/* Passing Score */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Passing Score</p>
                <p className="text-2xl font-semibold text-gray-900">{results.passingScore}%</p>
              </div>

              {/* Correct Answers */}
              {results.correctAnswers !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Correct Answers</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {results.correctAnswers}/{results.totalQuestions}
                  </p>
                </div>
              )}

              {/* Time Taken */}
              {results.timeTaken !== undefined && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time Taken</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.floor(results.timeTaken / 60)}:{String(results.timeTaken % 60).padStart(2, '0')}
                    </p>
                  </div>
                </div>
              )}

              {/* Attempt Number */}
              {results.attemptNumber !== undefined && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Attempt</p>
                  <p className="text-2xl font-semibold text-gray-900">#{results.attemptNumber}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Answer Review - Show All Answers */}
        {results.reviewAnswers && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Answer Review</h2>
            <div className="space-y-4">
              {results.reviewAnswers.map((review: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + idx * 0.05 }}
                  className={`rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow ${
                    review.correct
                      ? 'bg-white border-gray-100'
                      : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-500">Question {idx + 1}</span>
                    {review.correct && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    )}
                    {!review.correct && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 mb-4">{review.question}</p>
                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Your answer:</span> {review.userAnswer}
                    </p>
                    {review.correct && (
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Correct answer:</span> {review.userAnswer}
                      </p>
                    )}
                  </div>
                  {review.correct && review.explanation && (
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                      <p className="text-xs font-semibold text-green-700 mb-1">Why this is correct:</p>
                      <p className="text-sm text-gray-700">{review.explanation}</p>
                    </div>
                  )}
                  {!review.correct && (
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-800 mb-1">💡 Learning Opportunity:</p>
                      <p className="text-sm text-gray-700">Retake the quiz to discover the correct answer and understand why. The explanation will help you learn!</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Learning Message - Only on Fail */}
        {!passed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Learning Opportunity</h3>
                <p className="text-sm text-gray-700">
                  Review the course material and retake the quiz to improve your score. You'll be able to see the correct answers once you pass!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Actions */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 backdrop-blur-sm"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <Link href={`/student-dashboard/my-courses/${courseId}/learn`} className="flex-1">
              <Button fullWidth variant={ButtonVariant.Secondary} className="h-12 font-medium">
                Back to Course
              </Button>
            </Link>
            {!passed && (
              <Link href={`/student-dashboard/my-courses/${courseId}/quiz/${quizId}`} className="flex-1">
                <Button fullWidth variant={ButtonVariant.Primary} className="h-12 font-medium">
                  Retake Quiz
                </Button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={<LoadingState type={LoadingStateType.Skeleton} />}>
      <QuizResultsContent />
    </Suspense>
  );
}
