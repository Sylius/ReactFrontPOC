import React from "react";
import { BrowserRouter as Router } from "react-router";
import "react-loading-skeleton/dist/skeleton.css";

import "./assets/scss/main.scss";
import AppProviders from "./providers/AppProvider.tsx";
import AppRoutes from "./routes/AppRoutes.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </Router>
  );
};

export default App;
