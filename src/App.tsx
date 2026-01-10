import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CasePage from "./pages/CasePage";
import Rank from "./pages/Rank";
import Info from "./pages/Info";
import Master from "./pages/Master";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/main" element={<Main />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/case/:caseId" element={<CasePage />} />
          <Route path="/rank" element={<Rank />} />
          <Route path="/info" element={<Info />} />
          <Route path="/master20251208" element={<Master />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
