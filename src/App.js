import React from 'react';
import { Stage, Container, AppConsumer } from '@inlet/react-pixi'
import Logo from './components/Logo'
import logoImg from './logo.svg';
import './App.css';

function App() {
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;
  const logoSize = 200;

  return (
    <Stage width={width} height={height}>
      <Container>
        <AppConsumer>
          {app => <Logo app={app} image={logoImg} height={logoSize} width={logoSize*1.33} x={(width-logoSize*1.33)/2} y={(height-logoSize)/2} />}
        </AppConsumer>
      </Container>
    </Stage>
  );
}

export default App;
