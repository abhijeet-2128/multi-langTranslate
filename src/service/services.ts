import { translate } from 'free-translate';
import Multilingual, { Locale } from '../db/model';
import { ErrorMessage, SuccessMessage } from '../utils/responses';
const languages: Locale[] = ['en', 'hi', 'es', 'fr', 'ja'];

class TranslateService {
    async translateText(text: string) {
        const translations: { [key: string]: string } = {};
        for (const lang of languages) {
            try {
                const translation: string = await translate(text, { to: lang });
                translations[lang] = translation;
            } catch (error) {
                translations[lang] = ErrorMessage.TRANSLATION_NOT_AVAILABLE;
            }
        }
        const multilingualData = new Multilingual({
            originalText: text,
            translations: translations,
        });
        await multilingualData.save();
        const responseData = {
            message: SuccessMessage.TEXT_TRANSLATED_AND_STORED_SUCCESSFULLY,
            data: {
                originalText: multilingualData.originalText,
                translations: multilingualData.translations,
            },
        };
        return responseData;
    }

    async searchText(text: string, language: string) {
        try {
            if (!text || typeof text !== 'string') {
                throw new Error(ErrorMessage.SEARCH_QUERY_PARAMETER_IS_MISSING_OR_INVALID);
            }
    
            const regex = new RegExp(text, 'i');
            const multilingualData = await Multilingual.find({
                [`translations.${language || 'en'}`]: regex,
            });
    
            if (!multilingualData || multilingualData.length === 0) {
                throw new Error(ErrorMessage.TEXT_NOT_FOUND);
            }
    
            return {
                message: SuccessMessage.TEXT_FOUND,
                data: {
                    originalText: multilingualData[0].originalText,
                },
            };
        } catch (error) {
            throw new Error(ErrorMessage.FAILED_TO_SEARCH_TEXT);
        }
    }

}

export const translateService = new TranslateService();
