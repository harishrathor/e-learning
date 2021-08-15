import * as core from '@modules/core';

const UtilsService = core.exported.UtilsService;
const utilsService = UtilsService.getInstance();

export default class NumberGeneratorService {

    public generateNumberPairWithBorrowingProperty(minuedLength, subterhandLength) {
        if (subterhandLength > minuedLength) {
            throw new Error('Subtrhend lenght can not be greather than minued length');
        }
        const E = UtilsService.E;
        const minued = utilsService.getRandomInt(E[minuedLength - 1], E[minuedLength]);
        const minuedNumberStr = minued.toString();
        let min, max, firstDigit;
        if (subterhandLength < minuedLength) {
            min = minuedNumberStr.substr(minuedLength - subterhandLength, subterhandLength);
            max = E[subterhandLength];
        } else if (subterhandLength == minuedLength) {
            min = minuedNumberStr.substr(1, subterhandLength - 1);
            max = E[subterhandLength - 1];
            firstDigit = Number(minuedNumberStr[0]);
        }
        min = Number(min);
        let subtrahend = utilsService.getRandomInt(min, max);
        if (subterhandLength == minuedLength) {
            let subthNumberStr = subtrahend.toString();
            subthNumberStr = utilsService.getRandomInt(1, firstDigit) + subthNumberStr;
            subtrahend = Number(subthNumberStr);

        }
        return {
            minued,
            subtrahend
        };
    }

    public generateNumberPairWithoutBorrowingProperty(minuedLength, subterhandLength) {
        if (subterhandLength > minuedLength) {
            throw new Error('Subtrhend lenght can not be greather than minued length');
        }
        const E = UtilsService.E;
        const minued = utilsService.getRandomInt(E[minuedLength - 1], E[minuedLength]);
        const minuedNumberStr = minued.toString();
        let i = minuedLength - 1, subthNumberStr = '';
        let minIndex = (minuedLength - subterhandLength);
        while (i >= minIndex) {
            let min = 0;
            let max = Number(minuedNumberStr[i]) + 1;
            if (i == minIndex) {
                min = 1;
            }
            subthNumberStr = utilsService.getRandomInt(min, max).toString() + subthNumberStr;
            i--;
        }
        const subtrahend = Number(subthNumberStr);
        return {
            minued,
            subtrahend
        };
    }


    static getInstance() {
        let instance = globalThis.SERVER.getSingletonInstance(NumberGeneratorService.name);
        if (!instance) {
            instance = new NumberGeneratorService();
            globalThis.SERVER.setSingletonInstance(NumberGeneratorService.name, instance);
        }
        return instance;
    }
}