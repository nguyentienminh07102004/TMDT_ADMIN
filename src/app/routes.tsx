import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Movies } from "./pages/Movies";
import { Showtimes } from "./pages/Showtimes";
import { Cinemas } from "./pages/Cinemas";
import { Seats } from "./pages/Seats";
import { Bookings } from "./pages/Bookings";
import { Users } from "./pages/Users";
import { Promotions } from "./pages/Promotions";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "movies", Component: Movies },
      { path: "showtimes", Component: Showtimes },
      { path: "cinemas", Component: Cinemas },
      { path: "seats", Component: Seats },
      { path: "bookings", Component: Bookings },
      { path: "users", Component: Users },
      { path: "promotions", Component: Promotions },
    ],
  },
]);
