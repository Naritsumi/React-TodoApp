import './App.css';
import Login from './components/Login';
import Homepage from './components/Homepage';
import "bootstrap/dist/css/bootstrap.min.css"

import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
