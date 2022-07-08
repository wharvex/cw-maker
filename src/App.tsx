import React, { useState } from "react";
import "./App.css";
import { Props, initProps } from "./interfaces/Props";
import { driver } from "./Driver";
import { Puzzle } from "./components/Puzzle";

function App() {
  const [props, setProps] = useState<Props>(initProps(30, 13, 30));
  return (
    <div className="App">
      <div>
        <button onClick={() => setProps(driver(props))}>
          {props.dispWordsQty}
        </button>
      </div>
      <div>
        <Puzzle {...props} />
      </div>
    </div>
  );
}

export default App;
