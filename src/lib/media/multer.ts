import multer, { memoryStorage } from "multer";



export function multerUpload() {
    return multer({
        storage: memoryStorage(),
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    });
}


export function multerUploadSingle(fieldName: string) {
    return multerUpload().single(fieldName);
}


export function multerUploadArray(fieldName: string, maxCount: number) {
    return multerUpload().array(fieldName, maxCount)
}

