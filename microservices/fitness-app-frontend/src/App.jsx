import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import keycloak from './config/keycloak';
import { setCredentials } from './store/authSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false,
        });

        if (authenticated) {
          const tokenParsed = keycloak.tokenParsed;
          const keycloakId = tokenParsed.sub;
          
          dispatch(setCredentials({
            user: {
              email: tokenParsed.email,
              firstName: tokenParsed.given_name,
              lastName: tokenParsed.family_name,
            },
            token: keycloak.token,
            userId: keycloakId,
            keycloakId: keycloakId,
          }));

          // Set up token refresh
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(30).then((refreshed) => {
              if (refreshed) {
                dispatch(setCredentials({
                  user: {
                    email: keycloak.tokenParsed.email,
                    firstName: keycloak.tokenParsed.given_name,
                    lastName: keycloak.tokenParsed.family_name,
                  },
                  token: keycloak.token,
                  userId: keycloakId,
                  keycloakId: keycloakId,
                }));
              }
            });
          };
        }
      } catch (error) {
        console.error('Keycloak initialization failed:', error);
      }
    };

    initKeycloak();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/dashboard" replace />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <Layout>
                  <Activities />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Layout>
                  <Recommendations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
