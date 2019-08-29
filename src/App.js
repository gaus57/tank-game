import React from 'react';
import Game from './game/Game'
import './App.css';

function App() {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  return (
    <Game width={width} height={height} />
  );
}

export default App;
