import { RouterProvider } from "react-router-dom";
import { router } from "./routes/app.routes.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;