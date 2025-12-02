import axios from 'axios';
import FormData from 'form-data';

export const removeBackground = async (imageUrl: string): Promise<Buffer> => {
    const slazzerApiKey = process.env.SLAZZER_API_KEY;

    if (!slazzerApiKey) {
        throw new Error('SLAZZER_API_KEY is not defined');
    }

    try {
        // 1. Download the image
        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        const imageBuffer = Buffer.from(imageResponse.data, 'binary');

        // 2. Send to Slazzer
        const formData = new FormData();
        formData.append('source_image_file', imageBuffer, { filename: 'image.jpg' });

        const slazzerResponse = await axios.post('https://api.slazzer.com/v2.0/remove_image_background', formData, {
            headers: {
                'API-KEY': slazzerApiKey,
                ...formData.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        return Buffer.from(slazzerResponse.data, 'binary');

    } catch (error: any) {
        console.error('Slazzer Error:', error.response?.data ? error.response.data.toString() : error.message);
        throw new Error('Failed to process image with Slazzer');
    }
};
