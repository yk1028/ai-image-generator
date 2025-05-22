import { Request, Response } from 'express';
import { generateImage } from '../services/imageService';

export async function handleImageGeneration(req: Request, res: Response) {
    try {
        const { prompt, strengthModel, strengthClip } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: '프롬프트가 필요합니다.' });
        }

        const imageUrl = await generateImage(prompt, strengthModel, strengthClip);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ 
            error: '이미지 생성 중 오류가 발생했습니다.',
            details: error instanceof Error ? error.message : '알 수 없는 오류'
        });
    }
}