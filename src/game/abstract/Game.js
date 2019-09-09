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
     * @param {number} posX1
     * @param {number} posY1
     * @param {number} posX2
     * @param {number} posY2
     * @returns {Array|AbstractArea[]|AbstractTank[]}
     */
    getAreas = (posX1, posY1, posX2, posY2) => {
        const result = [];
        for (let x = Math.min(posX1, posX2); x <= Math.max(posX1, posX2); x++) {
            for (let y = Math.min(posY1, posY2); y <= Math.max(posY1, posY2); y++) {
                const area = this.getArea(x, y);
                area && result.push(area);
            }
        }

        return result;
    };

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

        return area ? AbstractArea(area) : null;
    };

    shot = () => {

    };

    hit = (area, shell) => {

    };

    tick = (delta) => {

    };
}