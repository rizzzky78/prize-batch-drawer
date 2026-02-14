import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SessionData, PrizeItem } from "@/data/prizes";

interface AppState {
  participants: string[];
  // winners: Map prizeId to array of winner names
  winners: Record<string, string[]>;
  eventName: string;
  setEventName: (name: string) => void;
  isLocked: boolean; // Locks participant addition after first draw

  addParticipant: (name: string) => void;
  addParticipants: (names: string[]) => void;
  removeParticipant: (name: string) => void;
  resetParticipants: () => void;

  // Record a winner for a specific prize
  addWinner: (prizeId: string, winnerName: string) => void;

  // Reset all draw results
  resetDraw: () => void;

  setLocked: (locked: boolean) => void;

  // Update a specific winner (for reshuffle)
  updateWinner: (prizeId: string, index: number, winnerName: string) => void;

  // Prize Management
  sessions: SessionData[];
  addPrize: (sessionName: string, name: string, quantity: number, allowReshuffle: boolean) => void;
  removePrize: (prizeId: string) => void;
  resetPrizes: () => void;
}
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      eventName: "Edit Label Acara", // Default value
      participants: [],
      sessions: [],
      winners: {},
      isLocked: false,

      setEventName: (name) => set({ eventName: name }),

      addParticipant: (name) =>
        set((state) => {
          return { participants: [...state.participants, name] };
        }),

      addParticipants: (names) =>
        set((state) => {
          // Filter out duplicates within the new batch and existing participants
          const uniqueNewNames = names.filter(
            (name) => !state.participants.includes(name)
          );
          return { participants: [...state.participants, ...uniqueNewNames] };
        }),

      removeParticipant: (name) =>
        set((state) => {
          // Check if this participant is a winner
          const allWinners = new Set<string>();
          Object.values(state.winners).forEach((list) => {
            if (Array.isArray(list)) {
              list.forEach((w) => allWinners.add(String(w)));
            }
          });

          if (allWinners.has(name)) {
            return state; // Cannot remove validation
          }

          return {
            participants: state.participants.filter((p) => p !== name),
          };
        }),

      resetParticipants: () =>
        set((state) => {
          // Keep winners, remove everyone else
          const allWinners = new Set<string>();
          Object.values(state.winners).forEach((list) => {
            if (Array.isArray(list)) {
              list.forEach((w) => allWinners.add(String(w)));
            }
          });

          // Filter participants to only keep those who are in the winners set
          const remainingParticipants = state.participants.filter((p) =>
            allWinners.has(p)
          );

          return { participants: remainingParticipants };
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

      updateWinner: (prizeId, index, winnerName) =>
        set((state) => {
          const currentWinners = [...(state.winners[prizeId] || [])];
          currentWinners[index] = winnerName;
          return {
            winners: {
              ...state.winners,
              [prizeId]: currentWinners,
            },
          };
        }),

      addPrize: (sessionName, name, quantity, allowReshuffle) =>
        set((state) => {
          const safeSessionId = sessionName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          const prizeId = `${safeSessionId}-${Date.now()}`;

          const newPrize: PrizeItem = {
            id: prizeId,
            category: sessionName,
            name,
            quantity,
          };

          const existingSessionIndex = state.sessions.findIndex(
            (s) => s.name === sessionName
          );

          if (existingSessionIndex !== -1) {
            const newSessions = [...state.sessions];
            const currentPrizes = newSessions[existingSessionIndex].prizes;
            // Update session with new prize AND update allowReshuffle setting
            newSessions[existingSessionIndex] = {
              ...newSessions[existingSessionIndex],
              allowReshuffle,
              prizes: [...currentPrizes, newPrize],
            };
            return { sessions: newSessions };
          } else {
            const newSession: SessionData = {
              id: safeSessionId || `session-${Date.now()}`,
              name: sessionName,
              allowReshuffle,
              prizes: [newPrize],
            };
            return { sessions: [...state.sessions, newSession] };
          }
        }),

      removePrize: (prizeId) =>
        set((state) => {
          const newSessions = state.sessions
            .map((session) => ({
              ...session,
              prizes: session.prizes.filter((p) => p.id !== prizeId),
            }))
            .filter((session) => session.prizes.length > 0);

          // Also remove any winners associated with this prize
          const newWinners = { ...state.winners };
          delete newWinners[prizeId];

          return { sessions: newSessions, winners: newWinners };
        }),

      resetPrizes: () =>
        set(() => ({
          sessions: [],
          winners: {}, // Clear winners as prizes are gone
          isLocked: false,
        })),
    }),
    {
      name: "doorprize-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
