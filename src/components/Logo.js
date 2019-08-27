import React from 'react';
import { Sprite } from '@inlet/react-pixi'

export default class Logo extends React.Component {
  state = { rotation: 0 }

  componentDidMount() {
    this.props.app.ticker.add(this.tick)
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.tick)
  }

  tick = delta => {
    this.setState(({ rotation }) => ({
      rotation: rotation + 0.1 * delta,
    }))
  }

  render() {
    const props = this.props;
    const pivot = (props.width/2)+','+(props.height/2)

    return <Sprite {...props} rotation={this.state.rotation} pivot={pivot} />
  }
}