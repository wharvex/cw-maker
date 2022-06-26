import React, { useState } from "react";
import "./App.css";
import { WordsMaker } from "./components/WordsMaker";

function App() {
  const [bankSize, setBankSize] = useState(1);
  return (
    <div className="App">
      <h1>Hi there.</h1>
      <label>
        Word Bank Size:{" "}
        <input
          type="number"
          value={bankSize}
          onChange={e => setBankSize(Number(e.target.value))}
        />
      </label>
      <br />
      <WordsMaker bankSize={bankSize} />
    </div>
  );
}

export default App;
