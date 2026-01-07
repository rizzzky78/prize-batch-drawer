import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  participants: string[];
  // winners: Map prizeId to array of winner names
  winners: Record<string, string[]>;
  eventName: string;
  setEventName: (name: string) => void;
  isLocked: boolean; // Locks participant addition after first draw

  addParticipant: (name: string) => void;
  removeParticipant: (name: string) => void;
  resetParticipants: () => void;

  // Record a winner for a specific prize
  addWinner: (prizeId: string, winnerName: string) => void;

  // Reset all draw results
  resetDraw: () => void;

  setLocked: (locked: boolean) => void;
}
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      eventName: "Label Acara", // Default value
      participants: [],
      winners: {},
      isLocked: false,

      setEventName: (name) => set({ eventName: name }),

      addParticipant: (name) =>
        set((state) => {
          if (state.isLocked) return state;
          return { participants: [...state.participants, name] };
        }),

      removeParticipant: (name) =>
        set((state) => ({
          participants: state.participants.filter((p) => p !== name),
        })),

      resetParticipants: () =>
        set((state) => {
          if (state.isLocked) return state; // Should probably allow reset if we reset everything? 
          // User requirement: "has reset participant". Usually implies full reset.
          // But if we have winners, removing participants might be weird if we want to keep history?
          // Let's assume reset participants clears them. 
          // If "not able to add participant anymore" is strict, maybe we unlock on reset.
          return { participants: [], isLocked: false };
        }),

      addWinner: (prizeId, winnerName) =>
        set((state) => {
          const currentWinners = state.winners[prizeId] || [];
          return {
            winners: {
              ...state.winners,
              [prizeId]: [...currentWinners, winnerName],
            },
            isLocked: true, // Lock adding participants once a winner is recorded
          };
        }),

      resetDraw: () =>
        set(() => ({
          winners: {},
          isLocked: false, // Unlock to allow adding more participants? 
          // Requirement: "has reset prize/draw". 
          // "has reset participant" is separate. 
          // If I reset draw, I probably want to re-shuffle existing participants.
        })),

      setLocked: (locked) => set({ isLocked: locked }),
    }),
    {
      name: 'doorprize-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
