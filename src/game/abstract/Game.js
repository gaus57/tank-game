import AbstractArea from "./Area";
import AbstractTank from "./Tank";

export default class AbstractGame {
    state = {
        tanks: {},
        areas: {},
        shells: {},
        shellIndex: 0,
    };

    constructor(state) {
        this.state = state;
    }

    /**
     *
     * @param {number} posX
     * @param {number} posY
     * @returns {AbstractArea|AbstractTank|null}
     */
    getArea = (posX, posY) => {
        for (const key in this.state.tanks) {
            const tank = AbstractTank(this.state.tanks[key]);
            if (tank.takesPosition(posX, posY)) {
                return tank;
            }
        }

        const area = this.state.areas[`${Math.floor(posX)}.${Math.floor(posY)}`];

        return data ? AbstractArea(data) : null;
    };

    tick = (delta) => {

    };
}