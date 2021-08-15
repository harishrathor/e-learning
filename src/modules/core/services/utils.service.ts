

export default class UtilsService {

    static E = {
        0: 1,
        1: 10,
        2: 100,
        3: 1000,
        4: 10000,
        5: 100000,
        6: 1000000,
        7: 10000000,
        8: 100000000,
        9: 1000000000,
        10: 10000000000,
    };

    protected _initialize() {

    }

    public getRandomInt(min = 0, max = 1) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    public totalPossiblePositiveNumbersWithLength(length: number) {
        let possibilities = 0;
        if (length > 1) {
            const multiplier = parseInt(((length - 1) / 10).toString());
            const remaining =  (length - 1) % 10;
            possibilities = 9;
            for (let i = 0; i < multiplier; i++) {
                possibilities *= UtilsService.E[10];
            }
            possibilities *= UtilsService.E[remaining]
        } else if (length == 1) {
            possibilities = 9;
        }
        return possibilities
    }

    static getInstance() {
        let instance = globalThis.SERVER.getSingletonInstance(UtilsService.name);
        if (!instance) {
            instance = new UtilsService();
            globalThis.SERVER.setSingletonInstance(UtilsService.name, instance);
        }
        return instance;
    }

}
