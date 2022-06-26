import React from 'react';
import './App.css';
import { WordsMaker } from './components/WordsMaker';

function App() {
  return (

    <div className="App">
      <h1>Hi there.</h1>
      <WordsMaker bankSize={5} />

    </div>
  );
}

export default App;
