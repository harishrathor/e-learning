const express = require('express');
const router = express.Router();
const APIRouter = express.Router();
const path = require('path');

router.all(globalThis.SERVER.all);
router.get('/', (req, res) => {
    res.send('Hello World').end();    
});

router.get('/assets/*', (req, res) => {
    res.sendFile(path.join(globalThis.SERVER.PATHS.globalThis.SERVER_ASSETS, req.url.replace('/assets', '')));
});

router.use('/api', APIRouter);

globalThis.SERVER.APP.use(router);
