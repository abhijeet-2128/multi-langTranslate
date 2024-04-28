import { translateService } from "../service/services";
import { Request, Response } from "express";
import { ErrorMessage, HttpStatusCode } from "../utils/responses";

class Controller {
    async translateText(req: Request, res: Response) {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            throw new Error(ErrorMessage.TEXT_PARAMETER_IS_MISSING_OR_INVALID);
        }
        try {
            const result = await translateService.translateText(text);
            res.status(HttpStatusCode.CREATED).json(result);
        } catch (error) {
            res.status(500).json({ error: ErrorMessage.FAILED__TO__TRANSLATE__TEXT });
        }
    }
    async searchText(req: Request, res: Response) {
        try {
            const result = await translateService.searchText(req.body.text, req.headers['accept-language'] as string);
            res.status(HttpStatusCode.OK).json(result);
        } catch (error) {
            res.status(500).json({ error: ErrorMessage.FAILED_TO_SEARCH_TEXT });
        }
    }
}

export const controller = new Controller();

