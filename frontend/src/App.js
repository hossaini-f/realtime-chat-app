import {Chat, Join} from './components';
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";


const App = () => {
  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Join />} />
      <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;