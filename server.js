import express from 'express';
import cors from 'cors';
import { app } from './src/App.js';
import * as scribdFlag from './src/const/ScribdFlag.js';
import * as scribdRegex from './src/const/ScribdRegex.js';
import * as slideshareRegex from './src/const/SlideshareRegex.js';
import * as everandRegex from './src/const/EverandRegex.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { configLoader } from './src/utils/io/ConfigLoader.js';
import { progressEmitter } from './src/utils/ProgressEmitter.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express();
const PORT = process.env.PORT || 3000;

// Middleware
expressApp.use(cors());
expressApp.use(express.json());
expressApp.use(express.static('public'));

// Serve frontend
expressApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SSE endpoint for progress updates
expressApp.get('/api/progress/:jobId', (req, res) => {
    const { jobId } = req.params;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const onProgress = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const onComplete = (data) => {
        res.write(`data: ${JSON.stringify({ type: 'complete', ...data })}\n\n`);
        res.end();
    };

    const onError = (data) => {
        res.write(`data: ${JSON.stringify({ type: 'error', ...data })}\n\n`);
        res.end();
    };

    progressEmitter.on(`progress:${jobId}`, onProgress);
    progressEmitter.once(`complete:${jobId}`, onComplete);
    progressEmitter.once(`error:${jobId}`, onError);

    req.on('close', () => {
        progressEmitter.removeListener(`progress:${jobId}`, onProgress);
        progressEmitter.removeListener(`complete:${jobId}`, onComplete);
        progressEmitter.removeListener(`error:${jobId}`, onError);
    });
});

// API endpoint để download
expressApp.post('/api/download', async (req, res) => {
    const jobId = uuidv4();
    
    try {
        const { url, flag } = req.body;
        
        if (!url) {
            return res.status(400).json({ 
                success: false, 
                error: 'URL is required',
                jobId 
            });
        }

        // Validate URL format using the same regex patterns as the app
        // Allow both http and https, with or without www
        const normalizedUrl = url.trim();
        const isScribd = /https?:\/\/(www\.)?scribd\.com/.test(normalizedUrl);
        const isSlideshare = /https?:\/\/(www\.)?slideshare\.net/.test(normalizedUrl);
        const isEverand = /https?:\/\/(www\.)?everand\.com/.test(normalizedUrl);

        if (!isScribd && !isSlideshare && !isEverand) {
            return res.status(400).json({ 
                success: false, 
                error: 'Unsupported URL format. Supported: scribd.com, slideshare.net, everand.com',
                jobId 
            });
        }

        // Start download in background
        (async () => {
            try {
                progressEmitter.update(jobId, {
                    stage: 'starting',
                    message: 'Đang khởi tạo...',
                    current: 0,
                    total: 100
                });

                // Execute download
                const downloadFlag = flag === '/i' ? scribdFlag.IMAGE : (flag ? scribdFlag.DEFAULT : undefined);
                
                progressEmitter.update(jobId, {
                    stage: 'downloading',
                    message: 'Đang tải xuống tài liệu...',
                    current: 20,
                    total: 100
                });

                await app.execute(url, downloadFlag);

                progressEmitter.update(jobId, {
                    stage: 'processing',
                    message: 'Đang xử lý file...',
                    current: 80,
                    total: 100
                });

                // Get output directory and find the downloaded file
                const outputDir = configLoader.load('DIRECTORY', 'output');
                const outputPath = path.join(__dirname, outputDir);
                
                // Find the most recently created file
                const files = fs.readdirSync(outputPath)
                    .map(file => ({
                        name: file,
                        time: fs.statSync(path.join(outputPath, file)).mtime.getTime()
                    }))
                    .sort((a, b) => b.time - a.time);

                if (files.length === 0) {
                    throw new Error('Download completed but no file found');
                }

                const latestFile = files[0].name;
                const filePath = path.join(outputPath, latestFile);

                progressEmitter.update(jobId, {
                    stage: 'completed',
                    message: 'Hoàn thành!',
                    current: 100,
                    total: 100,
                    filename: latestFile,
                    filePath: `/api/file/${jobId}/${latestFile}`
                });

                // Store file path temporarily for download
                if (!global.downloadFiles) {
                    global.downloadFiles = new Map();
                }
                global.downloadFiles.set(`${jobId}:${latestFile}`, filePath);

                progressEmitter.complete(jobId, {
                    filename: latestFile,
                    downloadUrl: `/api/file/${jobId}/${latestFile}`
                });

            } catch (error) {
                console.error('Download error:', error);
                progressEmitter.error(jobId, error);
            }
        })();

        // Return job ID immediately
        res.json({ 
            success: true, 
            jobId,
            message: 'Download started'
        });

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Download failed',
            jobId 
        });
    }
});

// Endpoint to download file
expressApp.get('/api/file/:jobId/:filename', (req, res) => {
    const { jobId, filename } = req.params;
    const fileKey = `${jobId}:${filename}`;
    
    if (!global.downloadFiles || !global.downloadFiles.has(fileKey)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const filePath = global.downloadFiles.get(fileKey);
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Error sending file' });
        } else {
            // Clean up after download
            setTimeout(() => {
                if (global.downloadFiles) {
                    global.downloadFiles.delete(fileKey);
                }
            }, 60000); // Clean up after 1 minute
        }
    });
});

// API endpoint để check status
expressApp.get('/api/status', (req, res) => {
    res.json({ 
        success: true, 
        status: 'Server is running',
        supportedSites: [
            'scribd.com',
            'slideshare.net',
            'everand.com'
        ]
    });
});

expressApp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

