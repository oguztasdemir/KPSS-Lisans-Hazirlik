/**
 * KPSS Lisans GY-GK - Central Store & Local Storage Management
 * Supports full JSON Export and Import for Vercel persistence,
 * detailed exam progress tracking, last question resumption, and per-exam statistics.
 */

const STORAGE_KEYS = {
  ANSWERS: 'kpss_user_answers',
  WRONGS: 'kpss_wrong_questions',
  FAVORITES: 'kpss_favorite_questions',
  NOTES: 'kpss_user_notes',
  SETTINGS: 'kpss_app_settings',
  DAILY_LOGS: 'kpss_daily_study_logs',
  EXAM_PROGRESS: 'kpss_exam_progress_tracker',
  COMPLETED_TOPICS: 'kpss_completed_topics'
};

const DEFAULT_SETTINGS = {
  theme: 'light',
  soundEnabled: true,
  dailyTarget: 50,
  examDate: '2026-09-06T10:15:00', // KPSS Lisans Sınav Tarihi
  examName: 'KPSS 2026 Lisans'
};

class Store {
  constructor() {
    this.answers = this._load(STORAGE_KEYS.ANSWERS, {});
    this.wrongQuestionIds = this._load(STORAGE_KEYS.WRONGS, []);
    this.favoriteIds = this._load(STORAGE_KEYS.FAVORITES, []);
    this.userNotes = this._load(STORAGE_KEYS.NOTES, {});
    this.settings = { ...DEFAULT_SETTINGS, ...this._load(STORAGE_KEYS.SETTINGS, {}) };
    this.dailyLogs = this._load(STORAGE_KEYS.DAILY_LOGS, {});
    this.examProgress = this._load(STORAGE_KEYS.EXAM_PROGRESS, {});
    this.completedTopics = this._load(STORAGE_KEYS.COMPLETED_TOPICS, []);
    
    this.allQuestions = [];
    this.subjects = [];
    this.flashcards = [];
    this.currentEvents = [];
  }


  _load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return fallback;
    }
  }

  _save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  // Record an answered question
  recordAnswer(questionId, selectedKey, isCorrect, subject, topic, year, questionIndex = 0) {
    const today = new Date().toISOString().split('T')[0];
    const normSubj = this.normalizeSubject(subject);
    
    this.answers[questionId] = {
      selected: selectedKey,
      isCorrect: isCorrect,
      timestamp: Date.now(),
      subject: normSubj,
      topic: topic,
      year: year
    };
    this._save(STORAGE_KEYS.ANSWERS, this.answers);

    // Update wrong questions pool
    if (!isCorrect) {
      if (!this.wrongQuestionIds.includes(questionId)) {
        this.wrongQuestionIds.push(questionId);
      }
    } else {
      this.wrongQuestionIds = this.wrongQuestionIds.filter(id => id !== questionId);
    }
    this._save(STORAGE_KEYS.WRONGS, this.wrongQuestionIds);

    // Update Exam Progress tracker
    if (year) {
      this.saveExamLastIndex(year, questionIndex);
    }

    // Update Daily Study Logs
    if (!this.dailyLogs[today]) {
      this.dailyLogs[today] = { totalSolved: 0, correct: 0, wrong: 0 };
    }
    this.dailyLogs[today].totalSolved += 1;
    if (isCorrect) this.dailyLogs[today].correct += 1;
    else this.dailyLogs[today].wrong += 1;
    this._save(STORAGE_KEYS.DAILY_LOGS, this.dailyLogs);

    this.notifyUpdate();
  }

  // Save last visited question index for an exam
  saveExamLastIndex(year, lastIndex) {
    if (!this.examProgress[year]) {
      this.examProgress[year] = { lastIndex: 0, lastUpdated: Date.now() };
    }
    this.examProgress[year].lastIndex = lastIndex;
    this.examProgress[year].lastUpdated = Date.now();
    this._save(STORAGE_KEYS.EXAM_PROGRESS, this.examProgress);
  }

  getExamLastIndex(year) {
    return this.examProgress[year]?.lastIndex || 0;
  }

  normalizeSubject(subj) {
    if (!subj) return 'Genel';
    const s = subj.trim();
    if (s.includes('Matematik') || s.includes('Geometri')) return 'Matematik & Geometri';
    if (s.includes('Türkçe') || s.includes('Turkce')) return 'Türkçe';
    if (s.includes('Tarih')) return 'Tarih';
    if (s.includes('Coğrafya') || s.includes('Cografya')) return 'Coğrafya';
    if (s.includes('Vatandaşlık') || s.includes('Vatandaslik')) return 'Vatandaşlık';
    if (s.includes('Güncel') || s.includes('Guncel')) return 'Güncel Bilgiler';
    return s;
  }

  // Calculate detailed stats for a specific exam year
  getExamStats(year) {
    const yearNum = parseInt(year, 10);
    const yearQuestions = this.allQuestions.filter(q => (q.yil === yearNum || q.year === yearNum));
    const total = yearQuestions.length || 120;
    
    let answered = 0;
    let correct = 0;
    let wrong = 0;

    const subjectBreakdown = {
      'Türkçe': { total: 30, correct: 0, wrong: 0, answered: 0 },
      'Matematik & Geometri': { total: 30, correct: 0, wrong: 0, answered: 0 },
      'Tarih': { total: 27, correct: 0, wrong: 0, answered: 0 },
      'Coğrafya': { total: 18, correct: 0, wrong: 0, answered: 0 },
      'Vatandaşlık': { total: 9, correct: 0, wrong: 0, answered: 0 },
      'Güncel Bilgiler': { total: 6, correct: 0, wrong: 0, answered: 0 }
    };

    yearQuestions.forEach(q => {
      const ans = this.answers[q.id];
      const normSubj = this.normalizeSubject(q.brans || q.subject);

      if (ans) {
        answered++;
        if (ans.isCorrect) {
          correct++;
          if (normSubj && subjectBreakdown[normSubj]) subjectBreakdown[normSubj].correct++;
        } else {
          wrong++;
          if (normSubj && subjectBreakdown[normSubj]) subjectBreakdown[normSubj].wrong++;
        }
        if (normSubj && subjectBreakdown[normSubj]) subjectBreakdown[normSubj].answered++;
      }
    });

    const empty = Math.max(0, total - answered);
    const net = Math.max(0, correct - (wrong * 0.25)).toFixed(2);
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const progressPercent = total > 0 ? Math.round((answered / total) * 100) : 0;
    const isFinished = (answered >= total && total > 0);
    const isStarted = answered > 0;
    const lastIndex = this.getExamLastIndex(yearNum);

    return {
      year: yearNum,
      total,
      answered,
      correct,
      wrong,
      empty,
      net,
      accuracy,
      progressPercent,
      isFinished,
      isStarted,
      lastIndex,
      subjectBreakdown
    };
  }

  // Reset progress for a specific exam
  resetExam(year) {
    const yearNum = parseInt(year, 10);
    const yearQuestions = this.allQuestions.filter(q => (q.yil === yearNum || q.year === yearNum));
    
    yearQuestions.forEach(q => {
      delete this.answers[q.id];
      this.wrongQuestionIds = this.wrongQuestionIds.filter(id => id !== q.id);
    });

    if (this.examProgress[yearNum]) {
      delete this.examProgress[yearNum];
    }

    this._save(STORAGE_KEYS.ANSWERS, this.answers);
    this._save(STORAGE_KEYS.WRONGS, this.wrongQuestionIds);
    this._save(STORAGE_KEYS.EXAM_PROGRESS, this.examProgress);
    this.notifyUpdate();
  }

  // Toggle favorite status
  toggleFavorite(questionId) {
    if (this.favoriteIds.includes(questionId)) {
      this.favoriteIds = this.favoriteIds.filter(id => id !== questionId);
    } else {
      this.favoriteIds.push(questionId);
    }
    this._save(STORAGE_KEYS.FAVORITES, this.favoriteIds);
    this.notifyUpdate();
    return this.isFavorite(questionId);
  }

  isFavorite(questionId) {
    return this.favoriteIds.includes(questionId);
  }

  // Save/Delete Question Note
  saveNote(questionId, noteText) {
    if (!noteText || noteText.trim() === '') {
      delete this.userNotes[questionId];
    } else {
      this.userNotes[questionId] = {
        text: noteText.trim(),
        updatedAt: Date.now()
      };
    }
    this._save(STORAGE_KEYS.NOTES, this.userNotes);
    this.notifyUpdate();
  }

  getNote(questionId) {
    return this.userNotes[questionId]?.text || '';
  }

  // Topic Lecture Completion Tracker
  toggleTopicCompleted(topicKey) {
    if (this.completedTopics.includes(topicKey)) {
      this.completedTopics = this.completedTopics.filter(k => k !== topicKey);
    } else {
      this.completedTopics.push(topicKey);
    }
    this._save(STORAGE_KEYS.COMPLETED_TOPICS, this.completedTopics);
    this.notifyUpdate();
    return this.isTopicCompleted(topicKey);
  }

  isTopicCompleted(topicKey) {
    return this.completedTopics.includes(topicKey);
  }

  getBranchTopicProgress(branchKey, topicsList = []) {
    if (!topicsList || topicsList.length === 0) return 0;
    const completedInBranch = topicsList.filter(t => this.isTopicCompleted(`${branchKey}_${t.id}`));
    return Math.round((completedInBranch.length / topicsList.length) * 100);
  }

  // Settings
  updateSettings(newSettings) {

    this.settings = { ...this.settings, ...newSettings };
    this._save(STORAGE_KEYS.SETTINGS, this.settings);
    this.applyTheme(this.settings.theme);
    this.notifyUpdate();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Global Analytics & Statistics helper
  getStatistics() {
    const totalSolved = Object.keys(this.answers).length;
    let totalCorrect = 0;
    let totalWrong = 0;

    const subjectStats = {
      'Türkçe': { solved: 0, correct: 0, wrong: 0 },
      'Matematik & Geometri': { solved: 0, correct: 0, wrong: 0 },
      'Tarih': { solved: 0, correct: 0, wrong: 0 },
      'Coğrafya': { solved: 0, correct: 0, wrong: 0 },
      'Vatandaşlık': { solved: 0, correct: 0, wrong: 0 },
      'Güncel Bilgiler': { solved: 0, correct: 0, wrong: 0 }
    };

    // Build quick lookup map if allQuestions exists
    const qMap = {};
    if (this.allQuestions && this.allQuestions.length > 0) {
      this.allQuestions.forEach(q => { if (q && q.id) qMap[q.id] = q; });
    }

    Object.entries(this.answers).forEach(([qId, ans]) => {
      if (ans.isCorrect) totalCorrect++;
      else totalWrong++;

      const questionObj = qMap[qId];
      const rawSubj = ans.subject || (questionObj ? (questionObj.brans || questionObj.subject) : null);
      const normSubj = this.normalizeSubject(rawSubj);

      if (normSubj && subjectStats[normSubj]) {
        subjectStats[normSubj].solved++;
        if (ans.isCorrect) subjectStats[normSubj].correct++;
        else subjectStats[normSubj].wrong++;
      }
    });

    const netScore = Math.max(0, totalCorrect - (totalWrong * 0.25));
    const accuracyRate = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;

    const today = new Date().toISOString().split('T')[0];
    const todayLog = this.dailyLogs[today] || { totalSolved: 0, correct: 0, wrong: 0 };

    return {
      totalSolved,
      totalCorrect,
      totalWrong,
      netScore: netScore.toFixed(2),
      accuracyRate,
      todaySolved: todayLog.totalSolved,
      todayCorrect: todayLog.correct,
      todayWrong: todayLog.wrong,
      wrongPoolCount: this.wrongQuestionIds.length,
      favoriteCount: this.favoriteIds.length,
      notesCount: Object.keys(this.userNotes).length,
      subjectStats
    };
  }

  // Vercel Backup Export & Import
  exportBackup() {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      answers: this.answers,
      wrongQuestionIds: this.wrongQuestionIds,
      favoriteIds: this.favoriteIds,
      userNotes: this.userNotes,
      settings: this.settings,
      dailyLogs: this.dailyLogs,
      examProgress: this.examProgress
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `kpss_lisans_yedek_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return true;
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.answers && !data.settings) {
        throw new Error('Geçersiz yedek dosyası formatı.');
      }

      if (data.answers) {
        this.answers = data.answers;
        this._save(STORAGE_KEYS.ANSWERS, this.answers);
      }
      if (data.wrongQuestionIds) {
        this.wrongQuestionIds = data.wrongQuestionIds;
        this._save(STORAGE_KEYS.WRONGS, this.wrongQuestionIds);
      }
      if (data.favoriteIds) {
        this.favoriteIds = data.favoriteIds;
        this._save(STORAGE_KEYS.FAVORITES, this.favoriteIds);
      }
      if (data.userNotes) {
        this.userNotes = data.userNotes;
        this._save(STORAGE_KEYS.NOTES, this.userNotes);
      }
      if (data.settings) {
        this.settings = { ...DEFAULT_SETTINGS, ...data.settings };
        this._save(STORAGE_KEYS.SETTINGS, this.settings);
        this.applyTheme(this.settings.theme);
      }
      if (data.dailyLogs) {
        this.dailyLogs = data.dailyLogs;
        this._save(STORAGE_KEYS.DAILY_LOGS, this.dailyLogs);
      }
      if (data.examProgress) {
        this.examProgress = data.examProgress;
        this._save(STORAGE_KEYS.EXAM_PROGRESS, this.examProgress);
      }

      this.notifyUpdate();
      return { success: true, message: 'Yedekleme başarıyla geri yüklendi!' };
    } catch (err) {
      return { success: false, message: 'Yedek yükleme başarısız: ' + err.message };
    }
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.WRONGS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.DAILY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.EXAM_PROGRESS);

    this.answers = {};
    this.wrongQuestionIds = [];
    this.favoriteIds = [];
    this.userNotes = {};
    this.dailyLogs = {};
    this.examProgress = {};

    this.notifyUpdate();
  }

  onUpdate(callback) {
    this._listeners = this._listeners || [];
    this._listeners.push(callback);
  }

  notifyUpdate() {
    if (this._listeners) {
      this._listeners.forEach(fn => fn(this));
    }
  }
}

export const store = new Store();
