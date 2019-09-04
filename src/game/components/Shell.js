import React from 'react';
import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';
import * as Constants from './../constants';

const SPEED = 1;
const Shell = PixiComponent('Shell', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x, y } = props;

        instance.clear();
        instance.beginFill(0xffffff);
        instance.drawCircle(x*Constants.SCALE, y*Constants.SCALE, .2*Constants.SCALE);
        instance.endFill();
    },
});

export default class extends React.Component {
    componentDidMount() {
        this.props.app.ticker.add(this.tick);
    }

    componentWillUnmount() {
        this.props.app.ticker.remove(this.tick);
    }

    tick = delta => {
        const {index, x, y, direction, hit, canMove, setData} = this.props;
        const change = {};
        switch (direction) {
            case Constants.DIRECTION_UP:
                change.y = y - SPEED * delta;
                break;
            case Constants.DIRECTION_DOWN:
                change.y = y + SPEED * delta;
                break;
            case Constants.DIRECTION_LEFT:
                change.x = x - SPEED * delta;
                break;
            case Constants.DIRECTION_RIGHT:
                change.x = x + SPEED * delta;
                break;
        }
        if (change.x !== undefined && change.x !== x) {
            if (change.x > x) {
                for (let i = Math.floor(x); i <= Math.floor(change.x); i++) {
                    if (!canMove(y, i, 1)) {
                        change.x = i;
                        hit(index, y, i);
                        return;
                    }
                }
            } else {
                for (let i = Math.floor(x); i >= Math.floor(change.x); i--) {
                    if (!canMove(y, i, 1)) {
                        change.x = i;
                        hit(index, y, i);
                        return;
                    }
                }
            }
        } else if (change.y !== undefined && change.y !== y) {
            if (change.y > y) {
                for (let i = Math.floor(y); i <= Math.floor(change.y); i++) {
                    if (!canMove(i, x, 1)) {
                        change.y = i;
                        hit(index, i, x);
                        return;
                    }
                }
            } else {
                for (let i = Math.floor(y); i >= Math.floor(change.y); i--) {
                    if (!canMove(i, x, 1)) {
                        change.y = i;
                        hit(index, i, x);
                        return;
                    }
                }
            }
        }
        setData(change);
    };

    render() {
        const {x, y} = this.props;

        return <Shell {...{x, y}} anchor='.5,.5' />
    }
}