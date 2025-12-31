import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState : {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        userId: localStorage.getItem('userId') || null,
        isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
        keycloakId: localStorage.getItem('keycloakId') || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, userId, keycloakId } = action.payload;
            state.user = user;
            state.token = token;
            state.userId = userId;
            state.keycloakId = keycloakId;
            state.isAuthenticated = true;
            
            // Persist to localStorage
            if (user) localStorage.setItem('user', JSON.stringify(user));
            if (token) localStorage.setItem('token', token);
            if (userId) localStorage.setItem('userId', userId);
            if (keycloakId) localStorage.setItem('keycloakId', keycloakId);
            localStorage.setItem('isAuthenticated', 'true');
        },
        updateToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.userId = null;
            state.keycloakId = null;
            state.isAuthenticated = false;
            
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('keycloakId');
            localStorage.removeItem('isAuthenticated');
        },
    },
});

export const { setCredentials, updateToken, logout } = authSlice.actions;
export default authSlice.reducer;