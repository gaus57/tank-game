export default class Tank {
    speed = 0;
    armor = 0;
    helth = 0;
    power = 0;
    reloadSpeed = 0;
    reload = 0;
    posX = 0;
    posY = 0;
    direction = null;
    moveDirection = null;

    constructor(params) {
        for (const key in params) {
            if (this.hasOwnProperty(key)) {
                this[key] = params[key];
            }
        }
    }

    canBeMoved() {
        return false;
    }

    move(delta) {

    }
}