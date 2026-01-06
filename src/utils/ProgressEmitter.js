import { EventEmitter } from 'events';

class ProgressEmitter extends EventEmitter {
    constructor() {
        super();
        if (!ProgressEmitter.instance) {
            ProgressEmitter.instance = this;
        }
        return ProgressEmitter.instance;
    }

    /**
     * Emit progress update
     * @param {string} jobId - Unique job identifier
     * @param {object} progress - Progress data { stage, current, total, message }
     */
    update(jobId, progress) {
        this.emit(`progress:${jobId}`, {
            ...progress,
            timestamp: Date.now()
        });
    }

    /**
     * Emit completion
     * @param {string} jobId - Unique job identifier
     * @param {object} result - Result data
     */
    complete(jobId, result) {
        this.emit(`complete:${jobId}`, result);
    }

    /**
     * Emit error
     * @param {string} jobId - Unique job identifier
     * @param {Error} error - Error object
     */
    error(jobId, error) {
        this.emit(`error:${jobId}`, {
            message: error.message,
            timestamp: Date.now()
        });
    }
}

export const progressEmitter = new ProgressEmitter();

