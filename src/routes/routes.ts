import express from 'express';
import { controller } from '../controller/controllers';

const router = express.Router();

router.post('/translate', controller.translateText);
router.post('/search', controller.searchText);

export default router;
