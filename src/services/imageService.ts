import axios from 'axios';
import { config } from '../config/config';
import path from 'path';
import fs from 'fs';

// 워크플로우 JSON 파일 로드
const workflow = JSON.parse(fs.readFileSync(path.join(__dirname, '../workflow/workflow.json'), 'utf-8'));

// 이미지 생성 상태 확인 함수
async function checkImageGenerationStatus(promptId: string): Promise<string | null> {
    try {
        const history = await axios.get(`${config.comfyuiApiUrl}/history/${promptId}`);
        const data = history.data[promptId];
        
        if (!data) {
            return null;
        }

        const outputs = data.outputs;
        if (!outputs) {
            return null;
        }

        // 첫 번째 출력 노드의 이미지를 찾습니다
        const firstOutputNode = Object.keys(outputs)[0];
        if (!firstOutputNode) {
            return null;
        }

        const images = outputs[firstOutputNode].images;
        if (!images || images.length === 0) {
            return null;
        }

        const image = images[0];
        return `${config.comfyuiApiUrl}/view?filename=${image.filename}&subfolder=${image.subfolder}`;
    } catch (error) {
        console.error('Error checking image status:', error);
        return null;
    }
}

export async function generateImage(prompt: string, strengthModel: number, strengthClip: number): Promise<string> {
    // 워크플로우 복사
    const workflowWithPrompt = JSON.parse(JSON.stringify(workflow));
    
    // 랜덤 seed 생성 (0부터 4294967295 사이의 정수)
    const randomSeed = Math.floor(Math.random() * 4294967296);
    
    // 프롬프트 노드 업데이트
    workflowWithPrompt['6'].inputs.text = prompt;
    workflowWithPrompt['7'].inputs.text = "blurry, low quality, distorted, extra limbs, bad anatomy, unrealistic, text, watermark, overexposed";
    
    // KSampler의 seed 값 업데이트
    workflowWithPrompt['3'].inputs.seed = randomSeed;

    // LoRA strength 설정 업데이트
    workflowWithPrompt['29'].inputs.strength_model = strengthModel;
    workflowWithPrompt['29'].inputs.strength_clip = strengthClip;

    // ComfyUI API 호출
    const response = await axios.post(`${config.comfyuiApiUrl}/api/prompt`, {
        prompt: workflowWithPrompt
    });

    const promptId = response.data.prompt_id;
    if (!promptId) {
        throw new Error('프롬프트 ID를 받지 못했습니다.');
    }

    // 이미지 생성이 완료될 때까지 대기
    const startTime = Date.now();
    let imageUrl = null;

    while (!imageUrl && Date.now() - startTime < config.maxWaitTime) {
        imageUrl = await checkImageGenerationStatus(promptId);
        if (!imageUrl) {
            await new Promise(resolve => setTimeout(resolve, config.checkInterval));
        }
    }

    if (!imageUrl) {
        throw new Error('이미지 생성 시간이 초과되었습니다.');
    }

    return imageUrl;
}