import { useEffect, useState } from "react";
import { checkHealth } from "./api/health";

function App() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("Backend connection failed");
      });
  }, []);

  return (
    <div>
      <h1>CodeMap AI</h1>
      <p>Backend status: {status}</p>
    </div>
  );
}

export default App;
