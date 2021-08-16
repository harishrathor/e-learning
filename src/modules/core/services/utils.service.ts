

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

    public flipCoin() {  
        if (Math.floor(Math.random() * 2) == 0) {
            return true;
        } else{
            return false;
        }
    }

    public async generateSimilarNumbers(n: number, totalCount: string): Promise<number[]> {
        return new Promise((resolve, reject) => {
            try {
                const nStr = n.toString();
                const map = {};
                const result = [];
                const generator = counter => {
                    try {
                        let coinResult = this.flipCoin(), min = 1, max = 9;
                        let randIndex = this.getRandomInt(0, nStr.length);
                        let refValue = Number(nStr[randIndex]);
                        if (nStr.length >= 3) {
                            let minIn = 1;
                            if (nStr.length >= 4) {
                                minIn = parseInt((nStr.length / 2).toString());
                            }
                            randIndex = this.getRandomInt(minIn, nStr.length);
                            refValue = Number(nStr[randIndex]);
                            if (randIndex == 0) {
                                if (coinResult) { //Add
                                    if (refValue == 9) {//Re-try
                                        return setTimeout(generator, 0, counter);
                                    } else {
                                        max = 9 - refValue;
                                        min = 1;
                                    }
                                } else { //Subtract
                                    min = 1;
                                    max = refValue - 1;
                                }
                            } else  {
                                if (coinResult) { //Add
                                    if (refValue == 9) {//Re-try
                                        return setTimeout(generator, 0, counter);
                                    } else {
                                        max = 9 - refValue;
                                        min = 1;
                                    }
                                } else {//Subtract
                                    if (refValue == 0) {//Re-try
                                        return setTimeout(generator, 0, counter);
                                    } else {
                                        min = 1;
                                        max = refValue;
                                    }
                                }
                            } 
                        }
                        
                        let randomNumber = this.getRandomInt(min, max);
                        let positionFromEnd = nStr.length - randIndex - 1;
                        randomNumber *= UtilsService.E[positionFromEnd];
                        let newNumber;
                        if (coinResult) {
                            newNumber = n + randomNumber;
                        } else {
                            newNumber = n - randomNumber;
                        }
                        if (map[newNumber] || newNumber < 0) {//Re-try
                            setTimeout(generator, 0, counter);
                        } else {
                            map[newNumber] = 1;
                            result.push(newNumber);
                            ++counter;
                            if (counter == totalCount) {
                                resolve(result);
                            } else {
                                setTimeout(generator, 0, counter);
                            }
                        }

                    } catch (error) {
                        reject(error);
                    }
                };
                setTimeout(generator, 0, 0)
            } catch (error) {
                reject(error);
            }    
        });
        
    }

    public swap(arr1, index1, arr2, index2) {
        const value = arr1[index1];
        arr1[index1] = arr2[index2];
        arr2[index2] = value;
        if (arr1 === arr2) {
            return arr1;
            }
        return [arr1, arr2];
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
