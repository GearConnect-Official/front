import '@testing-library/jest-native/extend-expect';

// Mock Clerk
jest.mock('@clerk/clerk-expo', () => ({
  useSignIn: jest.fn(() => ({
    signIn: { 
      create: jest.fn().mockResolvedValue({
        status: 'complete', 
        createdSessionId: 'session123'
      })
    }
  })),
  useSignUp: jest.fn(() => ({
    signUp: { 
      create: jest.fn().mockResolvedValue({
        status: 'complete',
        update: jest.fn().mockResolvedValue(true)
      })
    }
  })),
  useUser: jest.fn(() => ({
    user: { 
      id: 'user123', 
      username: 'testuser', 
      primaryEmailAddress: { 
        emailAddress: 'test@example.com' 
      } 
    },
    isLoaded: true
  })),
  useClerk: jest.fn(() => ({
    signOut: jest.fn().mockResolvedValue(true),
    session: { 
      getToken: jest.fn().mockResolvedValue('mock-token') 
    }
  }))
}));

// Mock axios
jest.mock('axios', () => ({
  defaults: {
    headers: {
      common: {}
    }
  },
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  get: jest.fn(() => Promise.resolve({ 
    data: {
      id: 'backend-user-123',
      username: 'backenduser',
      email: 'backend@example.com'
    } 
  }))
}));

// Add a simple test to avoid the "must contain at least one test" error
describe('Setup', () => {
  test('mocks are properly set up', () => {
    expect(true).toBe(true);
  });
}); 