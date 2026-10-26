import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  RotateCcw, 
  LogOut, 
  Layers, 
  Clock,
  XCircle,
  HelpCircle,
  CheckCircle2,
  Shield,
  Zap,
  Flag,
  Clipboard,
  Lock,
  Cpu,
  Megaphone,
  Building2,
  LayoutGrid
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
  topic_id?: string;
  category: string;
  difficulty: 'ROOKIE' | 'PRO-BOWLER' | 'HALL OF FAMER' | string;
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

// 9 Target Positions on the Board
const TARGET_POSITIONS = [
  { id: 'all', code: 'ALL', title: 'FULL COMBINE BOARD', subtitle: 'All 9 Topics Mixed', icon: LayoutGrid },
  { id: 'ol', code: 'OL', title: 'THE OFFENSIVE LINE', subtitle: 'SQL & Data Engineering', icon: Shield },
  { id: 'cb', code: 'CB', title: 'SCOUTING COMBINE', subtitle: 'Descriptive Stats & EDA', icon: Zap },
  { id: 'hc', code: 'HC', title: "COACHES' CHALLENGE", subtitle: 'Inferential Stats & Hypotheses', icon: Flag },
  { id: 'oc', code: 'OC', title: 'THE PLAYBOOK', subtitle: 'Supervised Machine Learning', icon: Clipboard },
  { id: 'fs', code: 'FS', title: 'ZONE COVERAGE', subtitle: 'Unsupervised & Anomaly Detection', icon: Lock },
  { id: 'st', code: 'ST', title: 'CLOCK MANAGEMENT', subtitle: 'Time Series & Forecasting', icon: Clock },
  { id: 'qb', code: 'QB', title: 'THE FRANCHISE QB', subtitle: 'Deep Learning (DL)', icon: Cpu },
  { id: 'dc', code: 'DC', title: 'AUDIBLES & CALLING', subtitle: 'NLP & Generative AI', icon: Megaphone },
  { id: 'gm', code: 'GM', title: 'THE FRONT OFFICE', subtitle: 'MLOps & System Architecture', icon: Building2 },
];

// 3 Prospect Levels (Difficulty) with allocated time per question
const PROSPECT_LEVELS = [
  { id: 'ROOKIE', title: 'ROOKIE', subtitle: 'Foundations', seconds: 45 },
  { id: 'PRO-BOWLER', title: 'PRO-BOWLER', subtitle: 'Production Depth', seconds: 60 },
  { id: 'HALL OF FAMER', title: 'HALL OF FAMER', subtitle: 'Architectural Rigor', seconds: 75 },
];

const getTimeForDifficulty = (diff?: string): number => {
  if (diff === 'HALL OF FAMER') return 75;
  if (diff === 'PRO-BOWLER') return 60;
  return 45; // Default ROOKIE
};

export function App() {
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

  // Main Navigation Tabs: 'sql' for Primary SQL Assessment, 'combine' for 9-Topic Multi-Discipline Combine
  const [activeTab, setActiveTab] = useState<'sql' | 'combine'>('sql');

  // Board selections
  const [selectedTopic, setSelectedTopic] = useState('ol');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'ROOKIE' | 'PRO-BOWLER' | 'HALL OF FAMER'>('ROOKIE');
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  // Active exam state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [submitting, setSubmitting] = useState(false);

  // Anti-cheat proctoring
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Result state
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
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdxRef.current < questionsRef.current.length - 1) {
      const nextIdx = currentIdxRef.current + 1;
      const nextQ = questionsRef.current[nextIdx];
      setCurrentIdx(nextIdx);
      setSecondsRemaining(getTimeForDifficulty(nextQ?.difficulty));
    } else {
      handleSubmitExam();
    }
  };

  // Anti-Cheat: Detect Tab switching, Window blur, and Lock Selection
  useEffect(() => {
    if (!examStarted || result) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            setWarningMessage('🚨 PROCTOR ALERT: You left the exam tab 3 times. Your test is being automatically submitted.');
            setShowWarningModal(true);
            setTimeout(() => {
              handleSubmitExam();
            }, 2000);
          } else {
            setWarningMessage(`⚠️ Warning ${newCount}/3: Leaving the exam tab is prohibited! Further attempts will auto-submit.`);
            setShowWarningModal(true);
          }
          return newCount;
        });
      }
    };

    const handleWindowBlur = () => {
      setTabSwitchCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setWarningMessage('🚨 PROCTOR ALERT: Window focus lost 3 times. Exam is being auto-submitted.');
          setShowWarningModal(true);
          setTimeout(() => {
            handleSubmitExam();
          }, 2000);
        } else {
          setWarningMessage(`⚠️ Warning ${newCount}/3: Window focus lost! Please stay inside the assessment window.`);
          setShowWarningModal(true);
        }
        return newCount;
      });
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleCopyCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['c', 'v', 'x', 'u', 't', 'n', 'w', 'a', 's', 'p'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [examStarted, result]);

  // Timer per question based on difficulty
  useEffect(() => {
    if (!examStarted || result || questions.length === 0) return;

    const currentQ = questions[currentIdx];
    const initialDuration = getTimeForDifficulty(currentQ?.difficulty);
    setSecondsRemaining(initialDuration);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, currentIdx, result, questions]);

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

  const handleGuestLogin = async () => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start guest session');
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

  const handleStartExam = async () => {
    if (!token) return;
    setLoadingQuestions(true);

    try {
      const topicToFetch = activeTab === 'sql' ? 'ol' : selectedTopic;
      const res = await fetch('/api/test/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          topicId: topicToFetch,
          difficulty: selectedDifficulty, 
          count: 30 
        }),
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
      setCurrentIdx(0);
      setSecondsRemaining(getTimeForDifficulty(data.questions[0]?.difficulty));
      setTabSwitchCount(0);
      setShowWarningModal(false);
      setExamStarted(true);
      setResult(null);

      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (err) {}
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

  // 1. Authentication View
  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-950 to-slate-950">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-indigo-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Interview Assessment Arena</h1>
            <p className="text-slate-400 text-sm mt-1">9-Topic Machine Learning & Data Engineering Combine</p>
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
              {authLoading ? 'Verifying...' : authMode === 'register' ? 'Register & Enter Arena' : 'Sign In to Arena'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-500 font-medium">
              or instant access
            </span>
          </div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={authLoading}
            className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>⚡ Continue as Guest (1-Click Test Login)</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Scorecard View
  if (result) {
    return (
      <div className="min-h-screen p-4 sm:p-8 bg-slate-950 max-w-3xl mx-auto flex flex-col justify-center">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Assessment Completed</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Combine Results Logged</h1>
          <p className="text-slate-400 text-sm mt-1">Evaluated across your chosen target positions.</p>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl mb-8 relative overflow-hidden border border-indigo-500/20 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Final Score</span>
              <div className="text-4xl font-extrabold text-white mt-2">
                {result.score} <span className="text-slate-500 text-xl font-normal">/ {result.totalQuestions}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Accuracy</span>
              <div className="text-4xl font-extrabold text-indigo-400 mt-2">
                {result.percentage}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</span>
              <div className={`text-2xl font-extrabold mt-2 flex items-center justify-center gap-1.5 ${
                result.passed ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {result.passed ? (
                  <>
                    <Award className="w-6 h-6 shrink-0" /> DRAFTED
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-6 h-6 shrink-0" /> EVALUATED
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1" />
            Evaluation finalized immediately. Assessment answer keys remain strictly confidential.
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => { setResult(null); setExamStarted(false); }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition"
          >
            <RotateCcw className="w-4 h-4" /> Return to Board
          </button>
        </div>
      </div>
    );
  }

  // 3. Active Test Taking Interface
  if (examStarted && questions.length > 0) {
    const currentQ = questions[currentIdx];
    const selected = selectedAnswers[currentQ.id];
    const answeredCount = Object.keys(selectedAnswers).length;
    const isLastQuestion = currentIdx === questions.length - 1;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col w-full select-none">
        {showWarningModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel p-8 rounded-3xl border border-rose-500/50 max-w-lg w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                <XCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Proctoring Security Alert</h2>
              <p className="text-rose-300 text-sm mb-6 leading-relaxed">{warningMessage}</p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition"
              >
                Return to Exam
              </button>
            </div>
          </div>
        )}

        <header className="glass-panel sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-slate-800 w-full">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wider">
              {currentQ.difficulty} LEVEL
            </span>
            <span className="hidden sm:inline text-slate-400 text-xs">
              Candidate: <strong className="text-white">{user.name}</strong>
            </span>
            {tabSwitchCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold">
                ⚠️ Violations: {tabSwitchCount}/3
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold border ${
              secondsRemaining <= 10 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse' 
                : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span>{secondsRemaining}s</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              {submitting ? 'Submitting...' : 'Finish Exam'}
            </button>
          </div>
        </header>

        <div className="w-full bg-slate-900 h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              secondsRemaining <= 10 ? 'bg-rose-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${(secondsRemaining / getTimeForDifficulty(currentQ.difficulty)) * 100}%` }}
          />
        </div>

        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col justify-between glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
                  Question {currentIdx + 1} of {questions.length} • {currentQ.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-relaxed mb-8">
                {currentQ.question_text}
              </h2>

              <div className="space-y-4">
                {currentQ.options.map((opt) => {
                  const isChecked = selected === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-5 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                        isChecked 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/15' 
                          : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-base sm:text-lg leading-snug pt-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end mt-10 pt-6 border-t border-slate-800">
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold shadow-lg shadow-indigo-600/20 transition"
              >
                {isLastQuestion ? 'Submit Exam' : 'Next Question'}
              </button>
            </div>
          </div>

          <div className="w-full lg:w-80 glass-panel p-6 rounded-3xl border border-slate-800 h-fit">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Exam Progress
            </h3>

            <div className="grid grid-cols-6 lg:grid-cols-5 gap-2.5">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <div
                    key={q.id}
                    className={`h-11 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-400 bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
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
          </div>
        </div>
      </div>
    );
  }

  // 4. Lobby: 9 Target Positions on the Board + 3 Prospect Levels
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <header className="glass-panel px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Interview Assessment Arena</h1>
            <p className="text-xs text-slate-400">Target Position Combine Board</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{user.name}</div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Navigation Tabs: SQL Primary vs 9-Topic Combine */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${
              activeTab === 'sql'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-400/30'
                : 'glass-card border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>PRIMARY SQL ASSESSMENT</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-950 text-indigo-300 font-mono border border-indigo-500/30">MAIN</span>
          </button>

          <button
            onClick={() => setActiveTab('combine')}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all border ${
              activeTab === 'combine'
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/25 ring-2 ring-cyan-400/30'
                : 'glass-card border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>9-TOPIC COMBINE BOARD</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-cyan-950 text-cyan-300 font-mono border border-cyan-500/30">9 IN 1</span>
          </button>
        </div>

        {/* Tab 1: PRIMARY SQL ASSESSMENT VIEW */}
        {activeTab === 'sql' && (
          <div className="glass-panel p-8 rounded-3xl border border-indigo-500/20 mb-8 text-center max-w-3xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              SQL & Data Engineering Assessment
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed mb-6">
              Official interview test covering SQL queries, filtering (`WHERE` vs `HAVING`), multi-table joins, subqueries, aggregations, window functions, and data transformations.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-indigo-300 font-medium">
              <span>🎯 30 Questions Randomized</span>
              <span>•</span>
              <span>⚡ Timed per difficulty</span>
              <span>•</span>
              <span>🔒 Anti-Cheat Enabled</span>
            </div>
          </div>
        )}

        {/* Tab 2: 9-TOPIC TARGET POSITION ON THE BOARD */}
        {activeTab === 'combine' && (
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center gap-2">
              SELECT TARGET POSITION ON THE BOARD
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TARGET_POSITIONS.map((pos) => {
                const isSelected = selectedTopic === pos.id;
                const IconComp = pos.icon;

                return (
                  <div
                    key={pos.id}
                    onClick={() => setSelectedTopic(pos.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all relative ${
                      isSelected
                        ? 'bg-slate-900/90 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-400/30'
                        : 'glass-card border-slate-800 hover:border-slate-700 bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl border ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-400'
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                        {pos.code}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold tracking-tight mb-1 ${
                      isSelected ? 'text-amber-400' : 'text-slate-100'
                    }`}>
                      {pos.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {pos.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: PROSPECT LEVEL (DIFFICULTY) */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
            PROSPECT LEVEL (DIFFICULTY)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PROSPECT_LEVELS.map((level) => {
              const isSelected = selectedDifficulty === level.id;
              return (
                <div
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id as any)}
                  className={`cursor-pointer p-4 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'glass-card border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`text-sm font-bold tracking-wider ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {level.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {level.subtitle} • {level.seconds}s/Q
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Launch Button */}
        <div className="text-center">
          <button
            onClick={handleStartExam}
            disabled={loadingQuestions}
            className="px-10 py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {loadingQuestions ? 'Preparing Position Combine...' : 'Start Assessment Combine'}
          </button>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-slate-500 border-t border-slate-800">
        Assessment Arena • 9-Topic Target Position Engine
      </footer>
    </div>
  );
}

export default App;
