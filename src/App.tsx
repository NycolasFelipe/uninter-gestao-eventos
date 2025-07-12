import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AuthContext from "./contexts/AuthContext";

// Routes
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";

// Hooks
import useAuth from "./hooks/useAuth";

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="app-loading">
        carregando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ ...auth }}>
      <Router>
        <Routes>
          {publicRoutes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  <Component />
                </>
              }
            />
          ))}
          {auth.isAuthenticated ? (
            privateRoutes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Component />
                  </>
                }
              />
            ))
          ) : (
            // Redireciona para login se não autenticado
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
