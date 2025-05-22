// 슬라이더 값 업데이트
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        e.target.nextElementSibling.textContent = value;
    });
});

// 이미지 생성 버튼 클릭 이벤트
document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const strengthModel = document.getElementById('strengthModel').value;
    const strengthClip = document.getElementById('strengthClip').value;
    const loading = document.getElementById('loading');
    const resultContainer = document.querySelector('.result-container');

    if (!prompt) {
        alert('프롬프트를 입력해주세요.');
        return;
    }

    try {
        loading.style.display = 'block';
        resultContainer.innerHTML = '<p class="placeholder-text">이미지 생성 중...</p>';

        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                strengthModel: parseFloat(strengthModel),
                strengthClip: parseFloat(strengthClip)
            }),
        });

        if (!response.ok) {
            throw new Error('이미지 생성에 실패했습니다.');
        }

        const { imageUrl } = await response.json();

        // 생성된 이미지 표시
        resultContainer.innerHTML = `
            <div class="space-y-4">
                <img src="${imageUrl}" alt="Generated image" class="w-full rounded-lg shadow-lg">
                <div class="text-sm text-gray-500">
                    <p>생성 시간: ${new Date().toLocaleString()}</p>
                    <p>프롬프트: ${prompt}</p>
                    <p>LoRA Model 강도: ${strengthModel}</p>
                    <p>LoRA Clip 강도: ${strengthClip}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = `
            <div class="text-red-500 text-center py-8">
                ${error.message}
            </div>
        `;
    } finally {
        loading.style.display = 'none';
    }
}); 