import HomeView from "../views/private/home/HomeView";
import EventDetailView from "src/views/private/event-detail/EventDetailView";
import ManageSchoolsView from "src/views/private/manage-schools/ManageSchoolsView";
import ManageUsersView from "src/views/private/manage-users/ManageUsersView";
import ManageVenuesView from "src/views/private/manage-venues/ManageVenuesView";

// Rotas privadas
const privateRoutes = [
  { path: "/home", component: HomeView },
  { path: "/manage/users", component: ManageUsersView },
  { path: "/manage/schools", component: ManageSchoolsView },
  { path: "/manage/venues", component: ManageVenuesView },
  { path: "/eventos/:eventId", component: EventDetailView, exact: true }
];

export default privateRoutes;