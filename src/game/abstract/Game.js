import AbstractArea from "./Area";
import AbstractTank from "./Tank";
import AbstractShell from "./Shell";

export default class AbstractGame {
    state = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        player: "1",
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
        // console.log('getAreas', posX1, posY1, posX2, posY2, result);
        return result;
    };

    /**
     *
     * @param {number} posX
     * @param {number} posY
     * @returns {AbstractArea|AbstractTank|null}
     */
    getArea = (posX, posY) => {
        if (posX < this.state.left || posX > this.state.right || posY < this.state.top || posY > this.state.bottom) {
            return new AbstractArea({canBeMovedTank: false, canBeMovedShell: false})
        }

        for (const key in this.state.tanks) {
            const tank = new AbstractTank(this.state.tanks[key]);
            if (tank.takesPosition(posX, posY)) {
                return tank;
            }
        }

        const area = this.state.areas[`${Math.floor(posX)}.${Math.floor(posY)}`];

        return area ? new AbstractArea(area) : null;
    };

    shot = () => {
        const tank = new AbstractTank(this.state.tanks[this.state.player]);
        this.state.shells[this.state.shellIndex] = tank.shot();
        this.state.shells[this.state.shellIndex].index = this.state.shellIndex;
        console.log('shot', this.state.shells[this.state.shellIndex]);
        this.state.shellIndex++;
    };

    hit = (area, shell) => {
        if (area instanceof AbstractArea) {
            console.log('area hit', area);
            delete this.state.areas[`${area.posX}.${area.posY}`];
        }
        if (area instanceof AbstractTank) {
            this.state.tanks[area.player] = {...this.state.tanks[area.player], ...area.hit(shell)}
        }
        delete this.state.shells[shell.index];
    };

    tick = (delta) => {
        for (const key in this.state.tanks) {
            const change = new AbstractTank(this.state.tanks[key]).tick(this, delta);
            if (change) {
                this.state.tanks[key] = {...this.state.tanks[key], ...change};
            }
        }
        for (const key in this.state.shells) {
            const change = new AbstractShell(this.state.shells[key]).tick(this, delta);
            console.log('tik shell '+key, change);
            if (change) {
                this.state.shells[key] = {...this.state.shells[key], ...change};
            }
        }
    };
}