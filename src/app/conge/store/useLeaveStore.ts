import { create } from 'zustand';
import { Leave } from '../../../types/leave/leave.types';

type LeaveStore = {
  leaves: Leave[];
  isModalOpen: boolean;
  selectedLeave: Leave | null;
  setLeaves: (leaves: Leave[]) => void;
  addLeave: (leave: Leave) => void;
  updateLeave: (id: string, leave: Leave) => void;
  deleteLeave: (id: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setSelectedLeave: (leave: Leave | null) => void;
};

export const useLeaveStore = create<LeaveStore>((set) => ({
  leaves: [],
  isModalOpen: false,
  selectedLeave: null,
  setLeaves: (leaves) => set({ leaves }),
  addLeave: (leave) => set((state) => ({ leaves: [...state.leaves, leave] })),
  updateLeave: (id, leave) =>
    set((state) => ({
      leaves: state.leaves.map((l) => (l.id === id ? leave : l)),
    })),
  deleteLeave: (id) =>
    set((state) => ({
      leaves: state.leaves.filter((l) => l.id !== id),
    })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedLeave: null }),
  setSelectedLeave: (leave) => set({ selectedLeave: leave }),
}));
