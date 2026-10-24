import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  RotateCcw, 
  LogOut, 
  Layers, 
  Clock,
  XCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface User {
  id: string;
  name: string;
  email: string;
}

interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

interface Question {
  id: string;
  index: number;
  category: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  question_text: string;
  options: QuestionOption[];
}

interface ExamResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
}

const QUESTION_TIME_SECONDS = 45; // 45 seconds strictly per question

export function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mcq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mcq_token'));
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Exam lobby state
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Active exam state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  
  // 45 seconds countdown timer per question
  const [secondsRemaining, setSecondsRemaining] = useState(QUESTION_TIME_SECONDS);
  const [extraTimeUsed, setExtraTimeUsed] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Result state (clean final score only, no answer leak)
  const [result, setResult] = useState<ExamResult | null>(null);

  const selectedAnswersRef = useRef(selectedAnswers);
  selectedAnswersRef.current = selectedAnswers;

  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;

  const tokenRef = useRef(token);
  tokenRef.current = token;

  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  // Submit exam and receive final score (no question/answer breakdown returned)
  const handleSubmitExam = async () => {
    const activeToken = tokenRef.current;
    const activeSessionId = sessionIdRef.current;
    const activeQuestions = questionsRef.current;
    const activeAnswers = selectedAnswersRef.current;

    if (!activeToken || !activeSessionId) return;
    setSubmitting(true);

    const answersPayload = activeQuestions.map((q) => ({
      questionId: q.id,
      selectedOption: activeAnswers[q.id] || null,
    }));

    try {
      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({
          sessionId: activeSessionId,
          answers: answersPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit exam');
      }

      setResult({
        sessionId: data.sessionId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
        passed: data.passed
      });

      if (data.percentage >= 60) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Move to next question or auto-submit when on last question
  const handleNextQuestion = () => {
    if (currentIdxRef.current < questionsRef.current.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSecondsRemaining(QUESTION_TIME_SECONDS);
    } else {
      handleSubmitExam();
    }
  };

  // 45s timer for each question
  useEffect(() => {
    if (!examStarted || result) return;

    setSecondsRemaining(QUESTION_TIME_SECONDS);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Time expired for this question: advance to next question
          handleNextQuestion();
          return QUESTION_TIME_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, currentIdx, result]);

  // Auth handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = authMode === 'register' 
      ? { name: authName, email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('mcq_user', JSON.stringify(data.user));
      localStorage.setItem('mcq_token', data.token);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setExamStarted(false);
    setResult(null);
    localStorage.removeItem('mcq_user');
    localStorage.removeItem('mcq_token');
  };

  // Start test session with selected difficulty
  const handleStartExam = async () => {
    if (!token) return;
    setLoadingQuestions(true);

    try {
      const res = await fetch('/api/test/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ difficulty, count: 30 }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          alert('Your session has expired. Please sign in again.');
          return;
        }
        throw new Error(data.error || 'Failed to start exam session');
      }

      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setSelectedAnswers({});
      setExtraTimeUsed({});
      setCurrentIdx(0);
      setSecondsRemaining(QUESTION_TIME_SECONDS);
      setExamStarted(true);
      setResult(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    const q = questions[currentIdx];
    setSelectedAnswers((prev) => ({
      ...prev,
      [q.id]: key,
    }));
  };

  // Allow candidate to add +15 seconds once per question when time is below 15s
  const handleAddExtraTime = () => {
    const currentQ = questions[currentIdx];
    if (!currentQ || extraTimeUsed[currentQ.id]) return;

    setSecondsRemaining((prev) => prev + 15);
    setExtraTimeUsed((prev) => ({
      ...prev,
      [currentQ.id]: true
    }));
  };

  // 1. Authentication View
  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-indigo-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Assessment MCQ Arena</h1>
            <p className="text-slate-400 text-sm mt-1">Cross-platform test portal (Mac, Windows, iOS, Android)</p>
          </div>

          <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-slate-800">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                authMode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Candidate
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Full Name / Roll Number
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Candidate Name (ID 101)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm outline-none transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Candidate Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="candidate@praxistechschool.in"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : authMode === 'register' ? 'Register & Enter Exam' : 'Sign In to Exam'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Instant Results & Scorecard View (Secure: Shows ONLY final score & percentage, NO answers leaked)
  if (result) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-slate-950 max-w-3xl mx-auto flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Assessment Completed</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Test Submitted Successfully</h1>
          <p className="text-slate-400 text-sm mt-1">Your responses have been securely logged in the assessment database.</p>
        </div>

        {/* Scorecard Hero */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl mb-8 relative overflow-hidden border border-indigo-500/20 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Your Final Score</span>
              <div className="text-4xl font-extrabold text-white mt-2">
                {result.score} <span className="text-slate-500 text-xl font-normal">/ {result.totalQuestions}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Percentage</span>
              <div className="text-4xl font-extrabold text-indigo-400 mt-2">
                {result.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Result Status</span>
              <div className={`text-2xl font-extrabold mt-2 flex items-center justify-center gap-1.5 ${
                result.passed ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {result.passed ? (
                  <>
                    <Award className="w-6 h-6 shrink-0" /> PASSED
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 shrink-0" /> COMPLETED
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1" />
            Evaluation finalized immediately. To maintain assessment confidentiality, correct and incorrect individual choices are not revealed.
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => { setResult(null); setExamStarted(false); }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition"
          >
            <RotateCcw className="w-4 h-4" /> Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Test Taking Interface (45 Seconds STRICT per question)
  if (examStarted && questions.length > 0) {
    const currentQ = questions[currentIdx];
    const selected = selectedAnswers[currentQ.id];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isLastQuestion = currentIdx === questions.length - 1;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Top Header bar with Per-Question 45s Timer */}
        <header className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wider">
              {difficulty} LEVEL
            </span>
            <span className="hidden sm:inline text-slate-400 text-xs">
              Candidate: <strong className="text-white">{user.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* +15s Extra Time Button (Visible when seconds <= 15 and not yet used for this question) */}
            {secondsRemaining <= 15 && !extraTimeUsed[currentQ.id] && (
              <button
                onClick={handleAddExtraTime}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition animate-bounce"
              >
                +15s Extra
              </button>
            )}

            {/* 45 Seconds Countdown Display */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-semibold border ${
              secondsRemaining <= 10 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{secondsRemaining}s left</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              {submitting ? 'Submitting...' : 'Finish Exam'}
            </button>
          </div>
        </header>

        {/* Question Progress Bar (45s visual decrease) */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              secondsRemaining <= 10 ? 'bg-rose-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${(secondsRemaining / QUESTION_TIME_SECONDS) * 100}%` }}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
          {/* Question Card */}
          <div className="flex-1 flex flex-col justify-between glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div>
              {/* Question metadata */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                  Question {currentIdx + 1} of {questions.length} • {currentQ.category}
                </span>
                <span className="text-xs text-slate-400">
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              {/* Question Statement */}
              <h2 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-6">
                {currentQ.question_text}
              </h2>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isChecked = selected === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                        isChecked 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                          : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm sm:text-base leading-snug pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advance Button (Explicit Next or auto after 45s) */}
            <div className="flex items-center justify-end mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
              >
                {isLastQuestion ? 'Submit Exam' : 'Next Question'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Grid Navigator on the Side */}
          <div className="w-full lg:w-72 glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Exam Progress
            </h3>

            <div className="grid grid-cols-6 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <div
                    key={q.id}
                    className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600/50 border border-emerald-500/60 inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800 inline-block" />
                <span>Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Test Lobby: Select Difficulty (Easy / Medium / Hard)
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="glass-panel px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span className="font-bold text-lg text-white">Assessment Arena</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Lobby Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-10">
          <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            45 Seconds Per Question • Instant Final Score
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Select Assessment Difficulty
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base mt-2">
            Each question gives you strictly <strong>45 seconds</strong>. Once completed, your final score is calculated and securely stored in PostgreSQL without revealing answer keys.
          </p>
        </div>

        {/* 3 Difficulty Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* EASY */}
          <div
            onClick={() => setDifficulty('EASY')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              difficulty === 'EASY'
                ? 'glass-panel border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30'
                : 'glass-card border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Easy Level</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              SQL filtering (WHERE vs HAVING), DISTINCT queries, basic JOINS, pattern wildcards, and COUNT aggregations.
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 45s per question
            </div>
          </div>

          {/* MEDIUM */}
          <div
            onClick={() => setDifficulty('MEDIUM')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              difficulty === 'MEDIUM'
                ? 'glass-panel border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                : 'glass-card border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Medium Level</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Window functions (DENSE_RANK, LAG, LEAD), correlated subqueries, 3VL NULL logic, and CTEs.
            </p>
            <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 45s per question
            </div>
          </div>

          {/* HARD */}
          <div
            onClick={() => setDifficulty('HARD')}
            className={`cursor-pointer p-6 rounded-2xl border transition-all ${
              difficulty === 'HARD'
                ? 'glass-panel border-rose-500 shadow-xl shadow-rose-500/10 ring-2 ring-rose-500/30'
                : 'glass-card border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Hard Level</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Serializable Snapshot Isolation (SSI), covering indexes, MVCC VACUUM dead tuples, and WAL.
            </p>
            <div className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 45s per question
            </div>
          </div>
        </div>

        {/* Start Assessment Action */}
        <div className="text-center">
          <button
            onClick={handleStartExam}
            disabled={loadingQuestions}
            className="px-8 py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {loadingQuestions ? 'Preparing Environment...' : `Start ${difficulty} Assessment (45s Per Question)`}
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-800">
        Assessment Engine • Cross-Platform Universal Web Client
      </footer>
    </div>
  );
}

export default App;
