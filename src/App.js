import { Routes, Route } from "react-router-dom";
import Ranking from "./Ranking";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Ranking />} />
      </Routes>
  );
};

export default App;