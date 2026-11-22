import multer, { memoryStorage } from "multer";



export function multerUpload() {
    return multer({ storage: memoryStorage() })
}


export function multerUploadSingle(fieldName: string) {
    return multerUpload().single(fieldName);
}


export function multerUploadArray(fieldName: string, maxCount: number) {
    return multerUpload().array(fieldName, maxCount)
}

