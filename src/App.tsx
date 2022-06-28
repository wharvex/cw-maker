import React, { useState } from "react";
import "./App.css";
import randomWords from "random-words";
import {
  Word,
  makeWord,
  setFirstWordPos,
  getWordCells
} from "./interfaces/Word";
import {
  PuzGridCell,
  makePuzGridCell,
  initPuzGrid
} from "./interfaces/PuzGridCell";

function App() {
  const wordBankSize: number = 20;
  const puzGridWidth: number = 20;
  const puzGridHeight: number = 40;
  const [displayedWordsQty, setDisplayedWordsQty] = useState<number>(1);
  const [wordBank, setWordBank] = useState<Word[]>(
    randomWords(wordBankSize).map(word => makeWord(word))
  );
  wordBank[0] = setFirstWordPos(wordBank[0]);
  const firstWordCells: PuzGridCell[] = getWordCells(wordBank[0], 0);
  const [puzGrid, setPuzGrid] = useState<PuzGridCell[]>(
    initPuzGrid(puzGridHeight, puzGridWidth, firstWordCells)
  );

  return (
    <div className="App">
      <button onClick={() => setDisplayedWordsQty(dw => dw + 1)}>
        {displayedWordsQty}
      </button>
    </div>
  );
}

export default App;
