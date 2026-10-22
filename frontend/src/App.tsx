import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  LogOut, 
  Layers, 
  BarChart3,
  HelpCircle
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

interface AnswerBreakdown {
  questionId: string;
  questionText: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  explanation: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface ExamResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  breakdown: AnswerBreakdown[];
}

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
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes for 30 questions
  const [submitting, setSubmitting] = useState(false);

  // Result state
  const [result, setResult] = useState<ExamResult | null>(null);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  // Timer countdown during exam
  useEffect(() => {
    if (!examStarted || result) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, result, selectedAnswers]);

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
        throw new Error(data.error || 'Failed to start exam session');
      }

      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setSelectedAnswers({});
      setCurrentIdx(0);
      setTimeLeft(30 * 60); // 30 minutes
      setExamStarted(true);
      setResult(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Select option for current question
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    const q = questions[currentIdx];
    setSelectedAnswers((prev) => ({
      ...prev,
      [q.id]: key,
    }));
  };

  // Submit exam and receive instant score
  const handleSubmitExam = async () => {
    if (!token || !sessionId || submitting) return;
    setSubmitting(true);

    const answersPayload = questions.map((q) => ({
      questionId: q.id,
      selectedOption: selectedAnswers[q.id] || null,
    }));

    try {
      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId,
          answers: answersPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit exam');
      }

      setResult(data);
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

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
            <h1 className="text-2xl font-bold tracking-tight text-white">Interview Assessment MCQ</h1>
            <p className="text-slate-400 text-sm mt-1">High-concurrency examination portal for 70+ candidates</p>
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
                  placeholder="e.g. Alex Johnson (ID 402)"
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
                placeholder="candidate@college.edu"
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
              {authLoading ? 'Verifying...' : authMode === 'register' ? 'Register & Enter Lobby' : 'Sign In to Exam'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Instant Results & Scorecard View
  if (result) {
    const filteredBreakdown = result.breakdown.filter((item) => {
      if (reviewFilter === 'correct') return item.isCorrect;
      if (reviewFilter === 'incorrect') return !item.isCorrect;
      return true;
    });

    return (
      <div className="min-h-screen p-4 sm:p-8 bg-slate-950 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Interview Assessment Report</span>
            <h1 className="text-2xl font-bold text-white mt-1">Assessment Complete</h1>
          </div>
          <button
            onClick={() => { setResult(null); setExamStarted(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm transition"
          >
            <RotateCcw className="w-4 h-4" /> Take Another Test
          </button>
        </div>

        {/* Scorecard Hero */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl mb-8 relative overflow-hidden border border-indigo-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Score</span>
              <div className="text-4xl font-extrabold text-white mt-2">
                {result.score} <span className="text-slate-500 text-xl font-normal">/ {result.totalQuestions}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Accuracy</span>
              <div className="text-4xl font-extrabold text-indigo-400 mt-2">
                {result.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</span>
              <div className={`text-2xl font-extrabold mt-3 flex items-center justify-center gap-1.5 ${
                result.passed ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {result.passed ? (
                  <>
                    <Award className="w-6 h-6 shrink-0" /> PASS
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 shrink-0" /> REVIEW REQUIRED
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Detailed Question Analysis ({result.breakdown.length} Questions)
            </h2>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1.5 rounded-lg ${reviewFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                All ({result.breakdown.length})
              </button>
              <button
                onClick={() => setReviewFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg ${reviewFilter === 'incorrect' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
              >
                Mistakes ({result.breakdown.filter(b => !b.isCorrect).length})
              </button>
              <button
                onClick={() => setReviewFilter('correct')}
                className={`px-3 py-1.5 rounded-lg ${reviewFilter === 'correct' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Correct ({result.breakdown.filter(b => b.isCorrect).length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredBreakdown.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCorrect 
                    ? 'bg-slate-900/50 border-emerald-500/20' 
                    : 'bg-slate-900/70 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
                      Q{idx + 1}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                      item.isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {item.isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  </div>
                </div>

                <p className="text-base font-medium text-slate-100 mb-4">{item.questionText}</p>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                    const isCandidateChoice = item.selectedOption === optKey;
                    const isCorrectChoice = item.correctOption === optKey;

                    let badgeStyle = 'bg-slate-800/60 border-slate-700/60 text-slate-300';
                    if (isCorrectChoice) {
                      badgeStyle = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 font-semibold';
                    } else if (isCandidateChoice && !item.isCorrect) {
                      badgeStyle = 'bg-rose-950/60 border-rose-500/50 text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 ${badgeStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center font-bold text-xs">
                          {optKey}
                        </span>
                        <span>{item.options[optKey]}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-indigo-400 block mb-1">Explanation:</span>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Active Test Taking Interface
  if (examStarted && questions.length > 0) {
    const currentQ = questions[currentIdx];
    const selected = selectedAnswers[currentQ.id];
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Top Header bar with Timer & Live Status */}
        <header className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wider">
              {difficulty} LEVEL
            </span>
            <span className="hidden sm:inline text-slate-400 text-xs">
              Candidate: <strong className="text-white">{user.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-semibold border ${
              timeLeft < 300 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' 
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              {submitting ? 'Evaluating...' : 'Finish & Submit'}
            </button>
          </div>
        </header>

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

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
              <button
                onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 text-sm font-medium transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                disabled={currentIdx === questions.length - 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 text-sm font-medium transition"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Grid Navigator on the Side */}
          <div className="w-full lg:w-72 glass-panel p-5 rounded-2xl border border-slate-800 h-fit">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Question Palette
            </h3>

            <div className="grid grid-cols-6 lg:grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
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
                <span>Unattempted</span>
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
          <span className="font-bold text-lg text-white">Interview Assessment Arena</span>
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
            Ready for 70+ Concurrent Examinees
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            Select Assessment Difficulty
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base mt-2">
            Each exam will present <strong>30 questions</strong> with 4 options each, randomized and shuffled specifically for your session. Immediate scoring will be rendered upon completion.
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
              Core fundamentals: Data structures basics, standard JS syntax, basic SQL queries, and Git commands.
            </p>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Recommended for junior candidates
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
              Full-stack concepts: Event Loop microtasks, ACID transactions, React reconciliation diffing, and B-Tree indexes.
            </p>
            <div className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Standard technical interview
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
              Senior & Architecture: CAP theorem, MVCC serializable isolation, distributed rate-limiting, and WAL recovery.
            </p>
            <div className="text-xs text-rose-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Rigorous senior assessment
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
            {loadingQuestions ? 'Preparing Test Environment...' : `Start ${difficulty} Assessment (30 Questions)`}
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-800">
        PostgreSQL-backed High Concurrency MCQ Engine • Built with Google Antigravity Architecture
      </footer>
    </div>
  );
}

export default App;
