import React, { useState } from "react";
import "./App.css";
import { Props, initProps } from "./interfaces/Props";
import { driver } from "./Driver";
import { Puzzle } from "./components/Puzzle";

function App() {
  const [props, setProps] = useState<Props>(initProps(15, 20, 20));
  return (
    <div className="App">
      <button onClick={() => setProps(driver(props))}>
        {props.dispWordsQty}
      </button>
      <Puzzle {...props} />
    </div>
  );
}

export default App;
