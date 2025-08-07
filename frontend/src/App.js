import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { theme } from "./theme";
import WithTitle from "./WithTitle";
import { routes } from "./routeConfig";
import { CartProvider } from "./CartContext";
import RootLayout from "./components/RootLayout";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

export function getUserFromToken() {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {routes.map(({ path, title, component: Component }) => (
        <Route
          key={path}
          path={path}
          element={<WithTitle component={Component} title={title} />}
        />
      ))}
    </Route>
  )
);
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
