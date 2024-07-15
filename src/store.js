import { create } from 'zustand';

const useStore = create((set) => ({
  formula: '',
  setFormula: (newFormula) => set({ formula: newFormula }),
}));

export default useStore;
