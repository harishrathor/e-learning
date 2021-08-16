import express from 'express';
import * as core from '@modules/core';

import NumberGeneratorService from '@modules/maths/services/number-generator.service';
const UtilsService = core.exported.UtilsService;

const numberGenerator = NumberGeneratorService.getInstance();
const utilsService = UtilsService.getInstance();

interface SubtNumbers {
    minuend: number;
    subtrahend: number;
    correctAnswer: number;
    options: number[];
};

export default class SubtractionQuestionGeneratorController extends core.exported.BaseController {


    protected _generatePair(minuedLength: number, subtrahendLength: number, hasBorrowing: boolean) {
        if (hasBorrowing == true) {
            return numberGenerator.generateNumberPairWithBorrowingProperty(minuedLength, subtrahendLength);
        } else {
            return numberGenerator.generateNumberPairWithoutBorrowingProperty(minuedLength, subtrahendLength);
        }
    }

    protected _makeQuestionDataWithOptions(minuend: number, subtrahend: number): Promise<SubtNumbers> {
        return new Promise(async (resolve, reject) => {
            try {
                const correctAnswer = minuend - subtrahend;
                const options =  await utilsService.generateSimilarNumbers(correctAnswer, 3);
                options.push(correctAnswer);
                const randomIndex = utilsService.getRandomInt(0, 3);
                utilsService.swap(options, randomIndex, options, options.length - 1);
                const questionData: SubtNumbers = {
                    minuend,
                    subtrahend,
                    correctAnswer,
                    options
                };
                resolve(questionData);
            } catch (error) {
                return reject(error);
            }
            
        });
    }

    /**
     * 
     * @param minuedLength number
     * @param subtrahendLength number
     * @param hasBorrowing number
     * @param totalCount number
     * @returns SubtNumbers[]
     */
    async generateNumbers(minuedLength: number, subtrahendLength: number, hasBorrowing: boolean, totalCount: number ): Promise<SubtNumbers[]> {
        return new Promise((resolve, reject) => {
            try {
                const result = [];
                const map = {};
                const generator = async (counter) => {
                    let data;
                    try {
                        data = this._generatePair(minuedLength, subtrahendLength, hasBorrowing);
                    } catch(error) {
                        reject(error);
                        return;
                    }
                    const minuend = data.minuend;
                    const subtrahend = data.subtrahend;
                    //@ToDo: Calls may go forever for invalid input
                    if (minuend == subtrahend || (map[minuend] && map[minuend][subtrahend])) {
                        setTimeout(generator, 0, counter);
                    } else {
                        if (!map[minuend]) {
                            map[minuend] = {};
                        }
                        map[minuend][subtrahend] = 1;
                        try {
                            const questionData = await this._makeQuestionDataWithOptions(minuend, subtrahend);
                            result.push(questionData);
                            ++counter;
                            if (counter == totalCount) {
                                setTimeout(resolve, 0, result);
                            } else {
                                setTimeout(generator, 0, counter);
                            }
                        } catch (error) {
                            reject(error);
                            console.log(error);
                        }
                    }
                };
                setTimeout(generator, 0, 0)
            } catch(error) {
                console.log(error);
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
            this.sendResponse(res, 200, questions);
        } catch(e) {
            console.log(e);
            this.sendResponse(res, 400, e);
        }
    };

}