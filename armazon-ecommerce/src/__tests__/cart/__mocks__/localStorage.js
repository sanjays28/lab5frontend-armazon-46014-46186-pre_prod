// Mock localStorage implementation for tests
const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  }),
  removeItem: jest.fn((key) => {
    delete mockLocalStorage.store[key];
  }),
};

// Set up localStorage mock for tests
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

// Export for direct usage in tests
export default mockLocalStorage;
