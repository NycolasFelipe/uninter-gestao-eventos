import LoginView from "../views/public/login/LoginView";

// Rotas públicas
const publicRoutes = [
  { path: "/", component: LoginView },
  { path: "/login", component: LoginView }
];

export default publicRoutes;