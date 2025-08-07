import EventDetailView from "src/views/private/event-detail/EventDetailView";
import EventReviewView from "src/views/private/event-reviews/EventReviewView";
import HomeView from "src/views/private/home/HomeView";
import ManageEventsView from "src/views/private/manage-events/ManageEventsView";
import ManageRolesView from "src/views/private/manage-roles/ManageRolesView";
import ManageSchoolsView from "src/views/private/manage-schools/ManageSchoolsView";
import ManageSubscriptionsView from "src/views/private/manage-subscriptions/ManageSubscriptionsView";
import ManageUsersView from "src/views/private/manage-users/ManageUsersView";
import ManageVenuesView from "src/views/private/manage-venues/ManageVenuesView";

// Rotas privadas
const privateRoutes = [
  { path: "/home", component: HomeView },
  { path: "/manage/users", component: ManageUsersView },
  { path: "/manage/schools", component: ManageSchoolsView },
  { path: "/manage/venues", component: ManageVenuesView },
  { path: "/manage/roles", component: ManageRolesView },
  { path: "/manage/events", component: ManageEventsView },
  { path: "/event/:id", component: EventDetailView, exact: true },
  { path: "/event/review", component: EventReviewView },
  { path: "/manage/subscriptions", component: ManageSubscriptionsView }
];

export default privateRoutes;