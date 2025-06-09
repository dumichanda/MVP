'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  location: string;
  bio: string;
}

interface Booking {
  id: string;
  experienceId: string;
  experienceTitle: string;
  hostName: string;
  date: string;
  time: string;
  guests: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  favorites: string[];
  theme: string;
  loading: boolean;
  error: string | null;
  notifications: any[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'UPDATE_BOOKING'; payload: { id: string; updates: Partial<Booking> } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  bookings: [],
  favorites: [],
  theme: 'default',
  loading: false,
  error: null,
  notifications: []
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        bookings: [],
        favorites: []
      };
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.payload]
      };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id
            ? { ...booking, ...action.payload.updates }
            : booking
        )
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mavuso_user');
    const savedBookings = localStorage.getItem('mavuso_bookings');
    const savedFavorites = localStorage.getItem('mavuso_favorites');
    const savedTheme = localStorage.getItem('mavuso_theme');

    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
    if (savedBookings) {
      const bookings = JSON.parse(savedBookings);
      bookings.forEach((booking: Booking) => {
        dispatch({ type: 'ADD_BOOKING', payload: booking });
      });
    }
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      favorites.forEach((id: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
      });
    }
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('mavuso_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('mavuso_user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('mavuso_bookings', JSON.stringify(state.bookings));
  }, [state.bookings]);

  useEffect(() => {
    localStorage.setItem('mavuso_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('mavuso_theme', state.theme);
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}