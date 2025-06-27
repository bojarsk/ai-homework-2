import React from "react";
import UserTable from "./components/UserTable/UserTable";
import "./styles/globals.css"; // Ensure this path is correct

const App: React.FC = () => {
  return (
    <div className="App">
      <UserTable />
    </div>
  );
};

export default App;
