import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DropdownTest from "./pages/DropdownTest";
import DropdownChild1 from "./pages/DropdownChild1";
import DropdownChild2 from "./pages/DropdownChild2";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/DropdownTest" element={<DropdownTest/>}/>
            <Route path="/DropdownChild1" element={<DropdownChild1/>}/>
            <Route path="/DropdownChild2" element={<DropdownChild2/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
