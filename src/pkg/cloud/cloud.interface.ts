// contract for cloud
// dependency injection 
// file-iformation 

export interface ICloudProvider {
    // return Key，ID，url
    uploadfile(file: any, path: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
    getFile(key: string): Promise<Buffer>;
    generatePresingerUrl(file: Partial<Express.Multer.File>, path: string): Promise<string>;
}