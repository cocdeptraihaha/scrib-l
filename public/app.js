const form = document.getElementById('downloadForm');
const urlInput = document.getElementById('url');
const imageModeCheckbox = document.getElementById('imageMode');
const downloadBtn = document.getElementById('downloadBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const statusDiv = document.getElementById('status');
const progressContainer = document.getElementById('progressContainer');
const progressMessage = document.getElementById('progressMessage');
const progressPercent = document.getElementById('progressPercent');
const progressBar = document.getElementById('progressBar');
const progressStage = document.getElementById('progressStage');

let eventSource = null;

function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.classList.remove('hidden');
}

function hideStatus() {
    statusDiv.classList.add('hidden');
}

function showProgress() {
    progressContainer.classList.remove('hidden');
    statusDiv.classList.add('hidden');
}

function hideProgress() {
    progressContainer.classList.add('hidden');
}

function updateProgress(progress) {
    const percent = Math.round((progress.current / progress.total) * 100);
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    progressMessage.textContent = progress.message || 'Đang xử lý...';
    
    const stageMap = {
        'starting': 'Khởi tạo',
        'downloading': 'Đang tải xuống',
        'processing': 'Đang xử lý',
        'completed': 'Hoàn thành'
    };
    progressStage.textContent = stageMap[progress.stage] || '';
}

function setLoading(loading) {
    downloadBtn.disabled = loading;
    if (loading) {
        btnText.textContent = 'Đang xử lý...';
        btnLoader.classList.remove('hidden');
    } else {
        btnText.textContent = 'Tải xuống';
        btnLoader.classList.add('hidden');
    }
}

function closeEventSource() {
    if (eventSource) {
        eventSource.close();
        eventSource = null;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    const imageMode = imageModeCheckbox.checked;
    
    if (!url) {
        showStatus('Vui lòng nhập URL', 'error');
        return;
    }

    // Validate URL format - chỉ cần kiểm tra domain
    const scribdRegex = /https?:\/\/(www\.)?scribd\.com/;
    const slideshareRegex = /https?:\/\/(www\.)?slideshare\.net/;
    const everandRegex = /https?:\/\/(www\.)?everand\.com/;

    if (!scribdRegex.test(url) && !slideshareRegex.test(url) && !everandRegex.test(url)) {
        showStatus('URL không được hỗ trợ. Vui lòng sử dụng URL từ scribd.com, slideshare.net hoặc everand.com', 'error');
        return;
    }

    setLoading(true);
    hideStatus();
    hideProgress();
    closeEventSource();

    try {
        // Start download
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                flag: imageMode ? '/i' : null
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Lỗi khi bắt đầu tải xuống');
        }

        const data = await response.json();
        const jobId = data.jobId;

        if (!jobId) {
            throw new Error('Không nhận được job ID');
        }

        // Show progress container
        showProgress();
        updateProgress({
            stage: 'starting',
            message: 'Đang khởi tạo...',
            current: 0,
            total: 100
        });

        // Connect to SSE for progress updates
        eventSource = new EventSource(`/api/progress/${jobId}`);

        eventSource.onmessage = (event) => {
            try {
                const progress = JSON.parse(event.data);
                
                if (progress.type === 'complete') {
                    // Download completed
                    updateProgress({
                        stage: 'completed',
                        message: 'Hoàn thành! Đang tải file...',
                        current: 100,
                        total: 100
                    });

                    // Download the file
                    if (progress.downloadUrl) {
                        const downloadUrl = progress.downloadUrl;
                        const filename = progress.filename || 'download.pdf';
                        
                        // Create download link
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        setTimeout(() => {
                            showStatus('Tải xuống thành công!', 'success');
                            hideProgress();
                            urlInput.value = '';
                            imageModeCheckbox.checked = false;
                            setLoading(false);
                            closeEventSource();
                        }, 1000);
                    }
                } else if (progress.type === 'error') {
                    throw new Error(progress.message || 'Lỗi khi tải xuống');
                } else {
                    // Update progress
                    updateProgress(progress);
                }
            } catch (error) {
                console.error('Error parsing progress:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            // Don't close immediately, might be temporary
        };

    } catch (error) {
        console.error('Download error:', error);
        showStatus(`Lỗi: ${error.message}`, 'error');
        hideProgress();
        setLoading(false);
        closeEventSource();
    }
});

// Check server status on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        if (data.success) {
            console.log('Server is ready');
        }
    } catch (error) {
        console.error('Server status check failed:', error);
        showStatus('Không thể kết nối đến server', 'error');
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    closeEventSource();
});
