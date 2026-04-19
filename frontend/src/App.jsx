import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar, Footer } from "./components/layout/index.jsx";
import {
  HomePage,
  SchoolsPage,
  SchoolDetailPage,
  ComparePage,
  WizardPage,
  VerifyReviewPage,
} from "./pages/index.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/schools/:slug" element={<SchoolDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/verify-review" element={<VerifyReviewPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
