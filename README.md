# ComfyUI Image Generator

ComfyUI API를 활용한 AI 이미지 생성 웹 애플리케이션입니다.

## 주요 기능
- 텍스트 프롬프트를 입력해 AI 이미지를 생성
- LoRA strength 등 다양한 파라미터 조정 지원
- ComfyUI API와 연동

## 폴더 구조
```
├── package.json
├── tsconfig.json
├── src/
│   ├── server.ts
│   ├── config/
│   │   └── config.ts
│   ├── controllers/
│   │   └── imageController.ts
│   ├── public/
│   │   ├── index.html
│   │   ├── css/
│   │   │   └── styles.css
│   │   └── js/
│   │       └── main.js
│   ├── routes/
│   │   └── imageRoutes.ts
│   ├── services/
│   │   └── imageService.ts
│   └── workflow/
│       └── workflow.json
```

## 설치 및 실행 방법
1. 저장소 클론
2. 의존성 설치
   ```bash
   npm install
   ```
3. 환경 변수 설정
   - `.env` 파일에 `PORT`와 `COMFYUI_API_URL`을 설정하세요.
4. 개발 서버 실행
   ```bash
   npm run dev
   ```
5. 브라우저에서 `http://localhost:3000` 접속

## 환경 변수 예시 (.env)
```
PORT=3000
COMFYUI_API_URL=http://127.0.0.1:8188
```

## API 엔드포인트
- `POST /api/generate`
  - 요청: `{ prompt: string, strengthModel?: number, strengthClip?: number }`
  - 응답: `{ imageUrl: string }`

## 라이선스
MIT License
