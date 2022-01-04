Array.prototype.shuffle = function () {
    let i, j, k;
    for (i = this.length -1; i > 0; i--) {
      j = Math.floor(Math.random() * i)
      k = this[i]
      this[i] = this[j]
      this[j] = k
    }
    return this;
}

export const GRUPOS = ["A","B","C","D","E","F","G","H"];
export const LOCAL = 0;
export const VISITANTE = 1;
export const Ranking = [];

export default class WorldCup {
    constructor (equipos) {
        this.equipos = equipos;
    }
    resultado() {
        const goles = [0,1,2,3,4,5,6,7,8,9,10];
        const golesAfavor = goles.shuffle();
        return golesAfavor[0];
    }
}