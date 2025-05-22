import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    comfyuiApiUrl: process.env.COMFYUI_API_URL || 'http://127.0.0.1:8188',
    maxWaitTime: 120000, // 2분
    checkInterval: 1000, // 1초
}; 