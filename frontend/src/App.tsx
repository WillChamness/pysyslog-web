import Navbar from "./components/Navbar";
import SyslogInput from "./components/SyslogInput";
import GetLogsForm from "./components/GetLogsForm";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<SyslogInput />} />
        <Route path="/sendlogs" element={<SyslogInput />} />
        <Route path="/getlogs" element={<GetLogsForm />} />
      </Routes>
    </div>
  );
}

export default App;
