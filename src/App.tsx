import React, { useState } from "react";
import "./App.css";
import { Props, initProps } from "./interfaces/Props";
import {driver} from "./Driver";

function App() {
  const [props, setProps] = useState<Props>(initProps(15, 20, 20));
  return (
    <div className="App">
      <button onClick={() => setProps(driver(props))}>
        {props.dispWordsQty}
      </button>
    </div>
  );
}

export default App;
