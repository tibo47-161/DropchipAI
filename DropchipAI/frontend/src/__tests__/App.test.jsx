/**
 * Unit / integration tests for DropchipAI React frontend.
 * Uses React Testing Library + Jest (bundled with react-scripts).
 *
 * All API calls are mocked so no backend is required.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock the API service so no real HTTP calls happen
jest.mock('../services/api', () => {
  const mockApi = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    setAuthToken: jest.fn(),
    clearAuthToken: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { headers: { common: {} } },
  };
  return mockApi;
});

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────

import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

/**
 * Renders a component wrapped in the minimal set of providers
 * required for the DropchipAI app (Theme + Auth + Router).
 */
function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

// ─── ThemeContext ─────────────────────────────────────────────────────────────

describe('ThemeContext', () => {
  test('ThemeProvider renders children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('ThemeProvider provides darkMode and toggleDarkMode', () => {
    const { useTheme } = require('../contexts/ThemeContext');
    let capturedContext;
    function Consumer() {
      capturedContext = useTheme();
      return null;
    }
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    expect(typeof capturedContext.darkMode).toBe('boolean');
    expect(typeof capturedContext.toggleDarkMode).toBe('function');
  });

  test('toggleDarkMode flips darkMode state', async () => {
    const { useTheme } = require('../contexts/ThemeContext');
    let capturedContext;
    function Consumer() {
      capturedContext = useTheme();
      return <button onClick={capturedContext.toggleDarkMode}>Toggle</button>;
    }
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );
    const initial = capturedContext.darkMode;
    fireEvent.click(screen.getByText('Toggle'));
    await waitFor(() => {
      expect(capturedContext.darkMode).toBe(!initial);
    });
  });
});

// ─── AuthContext ──────────────────────────────────────────────────────────────

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('AuthProvider renders children without crash', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <div data-testid="auth-child">Auth child</div>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('auth-child')).toBeInTheDocument();
  });

  test('initial isAuthenticated is false when no token in storage', async () => {
    const { useAuth } = require('../contexts/AuthContext');
    let capturedAuth;
    function Consumer() {
      capturedAuth = useAuth();
      return null;
    }
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Consumer />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(capturedAuth.loading).toBe(false));
    expect(capturedAuth.isAuthenticated).toBe(false);
  });

  test('logout clears isAuthenticated', async () => {
    const { useAuth } = require('../contexts/AuthContext');
    let capturedAuth;
    function Consumer() {
      capturedAuth = useAuth();
      return <button onClick={capturedAuth.logout}>Logout</button>;
    }
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Consumer />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(capturedAuth.loading).toBe(false));
    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(capturedAuth.isAuthenticated).toBe(false));
  });

  test('logout removes token from localStorage', async () => {
    localStorage.setItem('token', 'fake-token');
    const { useAuth } = require('../contexts/AuthContext');
    let capturedAuth;
    function Consumer() {
      capturedAuth = useAuth();
      return <button onClick={capturedAuth.logout}>Logout</button>;
    }

    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('Unauthorized'));

    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <Consumer />
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    await waitFor(() => expect(capturedAuth.loading).toBe(false));
    fireEvent.click(screen.getByText('Logout'));
    expect(localStorage.getItem('token')).toBeNull();
  });
});

// ─── Login page ───────────────────────────────────────────────────────────────

describe('Login page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  function renderLogin() {
    const Login = require('../pages/Login').default;
    return renderWithProviders(<Login />, { route: '/login' });
  }

  test('Login renders without crash', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    await waitFor(() =>
      expect(screen.queryByText(/sign in to your account/i)).toBeTruthy()
    );
  });

  test('Login shows email and password inputs', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('Login shows submit button', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('Login shows error when submitting empty form', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/please enter both email and password/i)
      ).toBeInTheDocument();
    });
  });

  test('Login shows "Forgot your password?" link', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  test('Login shows sign-up link', async () => {
    const api = require('../services/api');
    api.get.mockRejectedValueOnce(new Error('no token'));
    renderLogin();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
});

// ─── Register page ────────────────────────────────────────────────────────────

describe('Register page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  function renderRegister() {
    const Register = require('../pages/Register').default;
    return renderWithProviders(<Register />, { route: '/register' });
  }

  test('Register renders without crash', () => {
    renderRegister();
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  test('Register shows name, email, password fields', () => {
    renderRegister();
    // The name field is labelled "Full name" via htmlFor="name"
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  test('Register shows error when passwords do not match', async () => {
    renderRegister();
    const inputs = document.querySelectorAll('input');
    // Fill name, email, password, confirmPassword
    fireEvent.change(inputs[0], { target: { value: 'Test User' } });
    fireEvent.change(inputs[1], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[2], { target: { value: 'password123' } });
    fireEvent.change(inputs[3], { target: { value: 'different123' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('Register shows error for short password', async () => {
    renderRegister();
    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Test User' } });
    fireEvent.change(inputs[1], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[2], { target: { value: 'short' } });
    fireEvent.change(inputs[3], { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });
});

// ─── ForgotPassword page ──────────────────────────────────────────────────────

describe('ForgotPassword page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('ForgotPassword renders without crash', () => {
    const ForgotPassword = require('../pages/ForgotPassword').default;
    renderWithProviders(<ForgotPassword />, { route: '/forgot-password' });
    // Should render some form or text
    expect(document.body).toBeTruthy();
  });
});

// ─── SubscriptionContext ──────────────────────────────────────────────────────

describe('SubscriptionContext - plans data', () => {
  test('SubscriptionProvider renders children', () => {
    const { SubscriptionProvider } = require('../contexts/SubscriptionContext');
    render(
      <MemoryRouter>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <div data-testid="sub-child">Sub child</div>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByTestId('sub-child')).toBeInTheDocument();
  });
});
