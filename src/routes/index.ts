import express from 'express';
import path from 'path';

import MathsRouter from '@modules/maths/maths.module.routing'


const router = express.Router();
const APIRouter = express.Router();

router.all(globalThis.SERVER.all);
router.get('/', (req, res) => {
    res.send('Hello World').end();    
});

router.get('/assets/*', (req, res) => {
    res.sendFile(path.join(globalThis.SERVER.PATHS.globalThis.SERVER_ASSETS, req.url.replace('/assets', '')));
});

APIRouter.use(MathsRouter);

router.use('/api', APIRouter);

globalThis.SERVER.APP.use(router);
