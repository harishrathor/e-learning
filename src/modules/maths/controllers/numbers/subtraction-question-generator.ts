import express from 'express';
import * as core from '@modules/core';

import NumberGeneratorService from '@modules/maths/services/number-generator.service';
const UtilsService = core.exported.UtilsService;

const numberGenerator = NumberGeneratorService.getInstance();
const utilsService = UtilsService.getInstance();

interface SubtNumbers {
    minued: number;
    subtrahend: number;
    hasBorrowing?: boolean;
};

export default class SubtractionQuestionGeneratorController extends core.exported.BaseController {

    async generateNumbers(minuedLength: number, subtrahendLength: number, hasBorrowing: boolean, totalCount: number ): Promise<SubtNumbers[]> {
        return new Promise((resolve, reject) => {
            try {
                const result = [];
                const map = {};
                const generator = counter => {
                    let data;
                    try {
                        if (hasBorrowing == true) {
                            data = numberGenerator.generateNumberPairWithBorrowingProperty(minuedLength, subtrahendLength);
                        } else {
                            data = numberGenerator.generateNumberPairWithoutBorrowingProperty(minuedLength, subtrahendLength);
                        }
                    } catch(error) {
                        reject(error);
                        return;
                    }
                    const minued = data.minued;
                    const subtrahend = data.subtrahend;
                    //@ToDo: Calls may go forever
                    if (minued == subtrahend || (map[minued] && map[minued][subtrahend])) {
                      //  console.log('Repeat or Equal', minued, subtrahend);
                        setTimeout(generator, 0, counter);
                    } else {
                        if (!map[minued]) {
                            map[minued] = {};
                        }
                        map[minued][subtrahend] = 1;
                        result.push(data);
                        ++counter;
                        if (counter == totalCount) {
                            setTimeout(resolve, 0, result);
                        } else {
                            setTimeout(generator, 0, counter);
                        }
                    }
                };
                setTimeout(generator, 0, 0)
            } catch(error) {
                reject(error);
            }
        });
    }

    public async post(req: express.Request, res: express.Response) {
        try {
            const reqBody = req.body;
            const minuedLength = Number(reqBody.minuedLength);
            const subtrahendLength = Number(reqBody.subtrahendLength);
            let hasBorrowing = (reqBody.hasBorrowing == 'true' ? true : false);
            if (minuedLength <  1 || minuedLength > 10 || subtrahendLength <  1 || subtrahendLength > 10 || subtrahendLength > minuedLength) {
                return this.sendResponse(res, 400);
            } else if (minuedLength == 1 && hasBorrowing) {
                return this.sendResponse(res, 400, {}, "Number not possible");
            }
            let totalQuestions = Number(reqBody.totalQuestions);
           /*
           @ToDo: Implement validation of Max possible numbers
           const totalPossible = utilsService.totalPossiblePositiveNumbersWithLength(minuedLength);
            console.log('Request1', totalPossible, totalQuestions);
             if (totalPossible < totalQuestions) {
                totalQuestions = totalPossible;
            } */
            const questions = await this.generateNumbers(minuedLength, subtrahendLength, hasBorrowing, totalQuestions );
            console.log('Request2');
            const result = {
                hasBorrowing,
                questions,
            };
            this.sendResponse(res, 200, result);
        } catch(e) {
            this.sendResponse(res, 400, e);
        }
    };

}