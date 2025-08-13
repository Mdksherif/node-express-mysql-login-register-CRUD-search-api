const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

class StorageService {
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || 'local';
        this.initializeStorage();
    }

    initializeStorage() {
        if (this.storageType === 'gcs') {
            try {
                this.storage = new Storage({
                    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
                    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
                });
                this.bucket = this.storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
                console.log('✅ Google Cloud Storage initialized');
            } catch (error) {
                console.warn('⚠️ GCS initialization failed, falling back to local storage:', error.message);
                this.storageType = 'local';
                this.initializeLocalStorage();
            }
        } else {
            this.initializeLocalStorage();
        }
    }

    initializeLocalStorage() {
        this.localUploadDir = 'uploads/products';
        if (!fs.existsSync(this.localUploadDir)) {
            fs.mkdirSync(this.localUploadDir, { recursive: true });
        }
        console.log('✅ Local file storage initialized');
    }

    async uploadFile(file, filename) {
        try {
            if (this.storageType === 'gcs') {
                return await this.uploadToGCS(file, filename);
            } else {
                return await this.uploadToLocal(file, filename);
            }
        } catch (error) {
            console.error('Storage upload error:', error);
            throw new Error('File upload failed');
        }
    }

    async uploadToGCS(file, filename) {
        const blob = this.bucket.file(`products/${filename}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                cacheControl: 'public, max-age=31536000'
            }
        });

        return new Promise((resolve, reject) => {
            blobStream.on('error', reject);
            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/products/${filename}`;
                resolve(publicUrl);
            });
            blobStream.end(file.buffer);
        });
    }

    async uploadToLocal(file, filename) {
        const filePath = path.join(this.localUploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/products/${filename}`;
    }

    generateFilename(originalname) {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        const extension = path.extname(originalname);
        return `product-${timestamp}-${random}${extension}`;
    }

    async deleteFile(fileUrl) {
        try {
            if (this.storageType === 'gcs' && fileUrl.includes('storage.googleapis.com')) {
                const filename = fileUrl.split('/').pop();
                await this.bucket.file(`products/${filename}`).delete();
            } else if (fileUrl.startsWith('/uploads/')) {
                const filePath = path.join(process.cwd(), fileUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        } catch (error) {
            console.error('File deletion error:', error);
        }
    }
}

module.exports = new StorageService();