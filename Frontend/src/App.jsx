import { RouterProvider } from "react-router-dom";

import { router } from "./routes/app.routes.jsx";

import { AuthProvider } from "./context/AuthProvider.jsx";
import { InterviewProvider } from "./context/InterviewProvider.jsx";

const App = () => {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  );
};

export default App;