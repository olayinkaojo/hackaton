// ═══════════════════════════════════════════════
// useGameState — central state + logic hook
// ═══════════════════════════════════════════════
import { useState, useCallback } from 'react';
import { LEVEL_OUTFITS, LEVELS, QUESTIONS } from '../data/gameData.js';
import { overallCompliance } from '../utils/helpers.js';

export function initGameState(career, subcategory) {
  const levelData = LEVELS[0];
  return {
    career,
    subcategory,
    level: 1,
    xp: 0,
    xpForNextLevel: LEVELS[1]?.xpRequired || 300,
    outfit: LEVEL_OUTFITS[0],
    levelData,
    progress: 0,          // 0-100 obstacle progress
    lives: 3,
    streak: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    compliance: { registration: 10, tax: 10, employment: 10, data: 10, licences: 10 },
    unlockedLevels: [1],
    completedLevels: [],
    phase: 'obstacle',    // obstacle | question | levelup | gameover | won
    lastAnswerCorrect: null,
    lastAnswerExp: null,
    lastAnswerLaw: null,
  };
}

export function useGameState() {
  const [gs, setGs] = useState(null);

  const startGame = useCallback((career, subcategory) => {
    setGs(initGameState(career, subcategory));
  }, []);

  const answerQuestion = useCallback((questionIndex, answerIndex, questions) => {
    setGs(prev => {
      if (!prev) return prev;
      const q = questions[questionIndex];
      const correct = answerIndex === q.ans;
      const xpGain = correct ? q.xp : 0;
      const progressGain = correct ? 22 : -5;

      const newXp = prev.xp + xpGain;
      const newProgress = Math.max(0, Math.min(100, prev.progress + progressGain));
      const newStreak = correct ? prev.streak + 1 : 0;
      const newLives = correct ? prev.lives : Math.max(0, prev.lives - 1);

      // Update compliance based on question category
      const newCompliance = { ...prev.compliance };
      if (correct) {
        if (q.law.includes('CAMA') || q.law.includes('CAC')) newCompliance.registration = Math.min(100, newCompliance.registration + 5);
        if (q.law.includes('PITA') || q.law.includes('FIRS') || q.law.includes('VAT') || q.law.includes('CITA')) newCompliance.tax = Math.min(100, newCompliance.tax + 5);
        if (q.law.includes('PAYE') || q.law.includes('PENCOM') || q.law.includes('ECA') || q.law.includes('PRA')) newCompliance.employment = Math.min(100, newCompliance.employment + 5);
        if (q.law.includes('NDPA') || q.law.includes('NDPC') || q.law.includes('data')) newCompliance.data = Math.min(100, newCompliance.data + 5);
        if (q.law.includes('NAFDAC') || q.law.includes('CBN') || q.law.includes('SON') || q.law.includes('FCCPC')) newCompliance.licences = Math.min(100, newCompliance.licences + 5);
      }

      // Check level up
      const nextLevelData = LEVELS[prev.level]; // index = level (0-indexed so LEVELS[1] = level 2 data)
      let newLevel = prev.level;
      let newOutfit = prev.outfit;
      let newLevelData = prev.levelData;
      let newPhase = prev.phase;
      let newUnlocked = prev.unlockedLevels;
      let newCompleted = prev.completedLevels;

      if (newProgress >= 100 && newLives > 0) {
        // Obstacle complete — level up
        newPhase = 'levelup';
        newCompleted = [...prev.completedLevels, prev.level];
        if (prev.level < 13) {
          newLevel = prev.level + 1;
          newOutfit = LEVEL_OUTFITS[newLevel - 1];
          newLevelData = LEVELS[newLevel - 1];
          newUnlocked = [...new Set([...prev.unlockedLevels, newLevel])];
        } else {
          newPhase = 'won';
        }
      } else if (newLives <= 0) {
        newPhase = 'gameover';
      }

      return {
        ...prev,
        xp: newXp,
        progress: newProgress,
        streak: newStreak,
        lives: newLives,
        compliance: newCompliance,
        level: newLevel,
        outfit: newOutfit,
        levelData: newLevelData,
        phase: newPhase,
        unlockedLevels: newUnlocked,
        completedLevels: newCompleted,
        totalCorrect: prev.totalCorrect + (correct ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
        lastAnswerCorrect: correct,
        lastAnswerExp: q.exp,
        lastAnswerLaw: q.law,
      };
    });
  }, []);

  const continueAfterLevelUp = useCallback(() => {
    setGs(prev => {
      if (!prev) return prev;
      return { ...prev, phase: 'obstacle', progress: 0 };
    });
  }, []);

  const restartLevel = useCallback(() => {
    setGs(prev => {
      if (!prev) return prev;
      return { ...prev, phase: 'obstacle', progress: 0, lives: 3 };
    });
  }, []);

  const resetGame = useCallback(() => setGs(null), []);

  return { gs, startGame, answerQuestion, continueAfterLevelUp, restartLevel, resetGame };
}
