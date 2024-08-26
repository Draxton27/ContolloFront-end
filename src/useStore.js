import create from 'zustand';

// Set up the store using zustand
const useStore = create((set) => ({
  // State variables
  password: '', // Holds the password value
  passwordConfirmation: '', // Holds the password confirmation value
  error: '', // Holds any error message

  // Action to set the password state
  setPassword: (password) => set({ password }),

  // Action to set the password confirmation state
  setPasswordConfirmation: (passwordConfirmation) => set({ passwordConfirmation }),

  // Action to set an error message
  setError: (error) => set({ error }),

  // Action to clear the error message
  clearError: () => set({ error: '' }),
}));

export default useStore;
