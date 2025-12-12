import fs from 'node:fs/promises';
import path from 'node:path';
import { BASE_PATH, HOSTNAME, PORT, PROTOCOL } from '../../config/env.js';

const UPLOADS_ROOT = path.join(BASE_PATH, 'uploads');

const localDriver = {
    async upload(file, folder) {
        const uploadPath = path.join(UPLOADS_ROOT, folder);
        await fs.mkdir(uploadPath, { recursive: true });

        const fileName = `${Date.now()}_${file.originalname}`;
        const fullPath = path.join(uploadPath, fileName);

        await fs.rename(file.path, fullPath);

        const relativeWebPath = `/uploads/${folder}/${fileName}`;

        return {
            path: path.join(folder, fileName),
            url: relativeWebPath,
            absUrl: localDriver.getAbsUrl(relativeWebPath),
        };
    },

    async delete(filePath) {
        const fullPath = path.join(UPLOADS_ROOT, filePath);
        try {
            await fs.unlink(fullPath);
        } catch (e) {
            console.warn("File not found on disk:", fullPath);
        }
    },

    
    getAbsUrl(filePath) {
        return `${PROTOCOL}://${HOSTNAME}:${PORT}${filePath}`;
    },
};

export { localDriver, UPLOADS_ROOT };