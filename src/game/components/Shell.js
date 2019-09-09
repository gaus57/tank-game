import React from 'react';
import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';
import * as Constants from '../abstract/constants';

const Shell = PixiComponent('Shell', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
        const { posX, posY } = props;

        instance.clear();
        instance.beginFill(0xffffff);
        instance.drawCircle(posX*Constants.SCALE, posY*Constants.SCALE, .15*Constants.SCALE);
        instance.endFill();
    },
});

export default ({posX, posY}) => <Shell {...{posX, posY}} anchor='.5,.5' />