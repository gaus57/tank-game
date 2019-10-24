import React from 'react';
import * as Constants from '../abstract/constants';
import {Container, PixiComponent, Sprite} from '@inlet/react-pixi';
import {Graphics} from "pixi.js";

const ROTATION = {
    [Constants.DIRECTION_UP]: 0,
    [Constants.DIRECTION_DOWN]: 180*Math.PI/180,
    [Constants.DIRECTION_LEFT]: 270*Math.PI/180,
    [Constants.DIRECTION_RIGHT]: 90*Math.PI/180,
};

const Health = PixiComponent('Health', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
        const { size, health } = props;
        const border = Math.ceil(size * .02);
        const width = Math.ceil(size * .3);
        const height = Math.ceil(size * .06)
        const padding = (size - width) / 2;

        instance.clear();
        instance.beginFill(0x111111);
        instance.drawRect(padding - border, size * .75 - border, width + border * 2, height + border * 2);
        instance.endFill();
        instance.beginFill(0xff0000);
        instance.drawRect(padding, size * .75, width * health, height);
        instance.endFill();
    },
});

export default ({data}) => {
    const { posX, posY, size, direction, health, healthMax, enabled } = data;
    const rotation = ROTATION[direction];

    if (!enabled) {
        return null;
    }
    return <Container
        x={posX*Constants.SCALE}
        y={posY*Constants.SCALE}
        width={size*Constants.SCALE}
        height={size*Constants.SCALE}
        rotation={rotation}
        pivot={[.5 * size*Constants.SCALE, .5 * size*Constants.SCALE]}
    >
        <Sprite
            image='tank-3.png'
            width={size*Constants.SCALE}
            height={size*Constants.SCALE}
        />
        <Health size={size*Constants.SCALE} health={health/healthMax}/>
    </Container>
}