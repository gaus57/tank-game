import React from 'react';
import data from './game.json';
import Tank from './components/Tank';
import Area from './components/Area';
import Shell from './components/Shell';
import * as Constants from './abstract/constants';
import prepareGame from './helpers/PrepareGameData';
import {withPixiApp, Container, PixiComponent, Stage} from "@inlet/react-pixi";
import {Graphics} from "pixi.js";
import AbstractGame from "./abstract/Game";

const DIRECTION_KEYS = {
  'w': Constants.DIRECTION_UP,
  's': Constants.DIRECTION_DOWN,
  'a': Constants.DIRECTION_LEFT,
  'd': Constants.DIRECTION_RIGHT,
};

const MapBorder = PixiComponent('MapBorder', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, width, height } = props;

    instance.clear();
    instance.beginFill(0x000000);
    instance.drawRect((x-1)*Constants.SCALE, (y-1)*Constants.SCALE, width, height);
    instance.endFill();
  },
});

const Game = withPixiApp(class Game extends React.Component {
  state = {
    ...prepareGame(data),
    moveKeys: [],
  };

  componentDidMount() {
    this.props.app.ticker.add(this.tick);
    window.onkeypress = this.onkeypress;
    window.onkeyup = this.onkeyup;
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick);
    window.removeEventListener('onkeypress', this.onkeypress);
    window.removeEventListener('onkeyup', this.onkeyup);
  }

  tick = delta => {
    this.setState(state => {
      const game = new AbstractGame(state);
      game.tick(delta);

      return game.state;
    });
  };

  currentPlayer = () => {
    return this.state.tanks[this.state.player];
  };

  changePlayer = (player, change) => {
    this.setState(({tanks}) => ({
      tanks: {
        ...tanks,
        [player]: {
          ...tanks[player],
          ...change,
        }
      }
    }));
  };

  changeCurrentPlayer = (change) => {
    this.changePlayer(this.state.player, change);
  };

  onkeypress = (e) => {
    let { moveKeys } = this.state;
    if (DIRECTION_KEYS[e.key] !== undefined && !moveKeys.includes(e.key)) {
      moveKeys.push(e.key);
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
    // if (e.key === ' ') {
    //   const player = this.currentPlayer();
    //   this.shot(player.y, player.x, player.direction);
    // }
  };

  onkeyup = (e) => {
    let { moveKeys } = this.state;
    if (moveKeys.includes(e.key)) {
      moveKeys.splice(moveKeys.indexOf(e.key), 1);
      this.setState(() => ({
        moveKeys: moveKeys,
      }));
      this.changeDirection();
    }
  };

  changeDirection = () => {
    const {moveKeys} = this.state;
    if (moveKeys.length) {
      this.changeCurrentPlayer({moveDirection: DIRECTION_KEYS[moveKeys[moveKeys.length - 1]]});
    } else {
      this.changeCurrentPlayer({moveDirection: null});
    }
  };

  render() {
    const { width, height } = this.props;
    const { tanks, areas, shells, top, bottom, left, right } = this.state;
    const mapWidth = (right - left + 1) * Constants.SCALE;
    const mapHeight = (bottom - top + 1) * Constants.SCALE;
    const currentPlayer = this.currentPlayer();

    return <Container position={[(left - currentPlayer.posX) * Constants.SCALE + width / 2, (top - currentPlayer.posY) * Constants.SCALE + height / 2]}>
        <MapBorder x={left} y={top} width={mapWidth} height={mapHeight} />
        {Object.entries(tanks).map(([index, tank]) => <Tank key={index} data={tank} />)}
        {Object.entries(shells).map(([index, shell]) => <Shell key={index} {...shell} />)}
        {Object.entries(areas).map(([index, area]) => <Area key={index} {...area} />)}
    </Container>
  }
});

export default ({width, height}) => <Stage width={width} height={height} options={{ backgroundColor: 0x333333 }}>
  <Game {...{width, height}} />
</Stage>