import { Request, Response } from 'express';
import { removeBackground } from '../utils/slazzerClient';

export const removeBgUrl = async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ success: false, message: 'imageUrl is required' });
    }

    try {
        const cleanImageBuffer = await removeBackground(imageUrl);
        const cleanImageBase64 = `data:image/png;base64,${cleanImageBuffer.toString('base64')}`;

        return res.json({
            success: true,
            cleanImageBase64
        });
    } catch (error: any) {
        console.error('Controller Error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
