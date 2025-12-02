import { Request, Response, NextFunction } from 'express';

export const checkApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const internalKey = process.env.INTERNAL_API_KEY;

    if (!apiKey || apiKey !== internalKey) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid API Key' });
        return;
    }

    next();
};
