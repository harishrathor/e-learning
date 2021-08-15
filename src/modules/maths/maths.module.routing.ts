import express from 'express';
import subtQuesGencontroller from "@modules/maths/controllers/numbers";

const router = express.Router();
const routeModulePrefix = '/maths'


router.route(`${routeModulePrefix}/numbers/subtract-question-generator`)
    .post(subtQuesGencontroller.post.bind(subtQuesGencontroller))
    .get(subtQuesGencontroller.get.bind(subtQuesGencontroller));


export default router;


