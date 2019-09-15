export default class AbstractArea {
    posX = 0;
    posY = 0;
    canBeMovedTank = false;
    canBeMovedShell = false;
    speedCoefficient = 0;

    constructor(params) {
        for (const key in params) {
            if (this.hasOwnProperty(key)) {
                this[key] = params[key];
            }
        }
    }

    /**
     *
     * @param {number} speed
     * @returns {number}
     */
    movedSpeed = (speed) => {
        return speed * this.speedCoefficient;
    };

    /**
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    canBeMoved = (obj) => {
        if (obj.class === 'AbstractShell') {
            return this.canBeMovedShell;
        } else if (obj.class === 'AbstractTank') {
            return this.canBeMovedTank;
        }

        return false;
    };
}