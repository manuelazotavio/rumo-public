import { create } from 'zustand'

const useRoteirosStore = create((set) => ({
  roteiros: [],
  setRoteiros: (newRoteiros) => set(() => ({ roteiros: newRoteiros })),
  addRoteiros: (newRoteiro) => set((state) => ({ roteiros: [...state.roteiros, newRoteiro] })),
  removeRoteiros: (id) => set((state) => {
    const roteirosFiltrado = state.roteiros.filter((roteiro => roteiro.id !== id))
    return {roteiros: roteirosFiltrado}
  }),
  updateRoteiros: (newRoteiro) => set((state) => ({ roteiros: state.roteiros.map((roteiro) => (roteiro.id === newRoteiro.id ? newRoteiro : roteiro))})),
}))

export default useRoteirosStore;  
