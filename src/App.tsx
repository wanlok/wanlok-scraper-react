import { useEffect, useState } from "react";

function App() {
  const [json, setJson] = useState("Loading...");

  useEffect(() => {
    fetch("/api/tasks")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setJson(JSON.stringify(data, null, 2)))
      .catch((error) => setJson(`Error: ${error.message}`));
  }, []);

  return (
    <main>
      <h1>Scraper</h1>
      <pre>{json}</pre>
    </main>
  );
}

export default App;
