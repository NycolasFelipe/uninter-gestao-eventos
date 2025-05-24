import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Routes
import publicRoutes from "./routes/publicRoutes";
import privateRoutes from "./routes/privateRoutes";

function App() {
  const [isAuthenticated] = useState(false);

  return (
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
        {isAuthenticated ? (
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
  )
}

export default App
