import { create } from "zustand";

interface ScoreStore {
  score: number;
  reduceScore: (points: number) => void;
  increaseScore: (points: number) => void;
  resetScore: () => void;
}

export const useScoreStore = create<ScoreStore>((set) => ({
  score: 1000, // Starting score
  reduceScore: (points: number) =>
    set((state) => {
      const newScore = Math.max(0, state.score - points);
      return { score: newScore };
    }),
  increaseScore: (points: number) =>
    set((state) => ({
      score: state.score + points,
    })),
  resetScore: () => set({ score: 1000 }),
}));
