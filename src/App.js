import React from 'react';
import { Stage, Container, AppConsumer } from '@inlet/react-pixi'
import Tank from './components/Tank'
import './App.css';

function App() {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  return (
    <Stage width={width} height={height}>
      <Container>
        <AppConsumer>
          {app => <Tank app={app} />}
        </AppConsumer>
      </Container>
    </Stage>
  );
}

export default App;
