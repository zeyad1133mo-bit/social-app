import { Readable } from "stream";
import { ICloudProvider } from "./cloud.interface";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";

interface S3Config {
    region: string;
    accessKey: string;
    secretAccessKey: string;
    bucketName: string;
}


export class S3CloudProvider implements ICloudProvider {
    private client: S3Client;
    private readonly bucketName: string;

    constructor(config: S3Config) {
        this.client = new S3Client({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKey,
                secretAccessKey: config.secretAccessKey
            }

        })
        this.bucketName = config.bucketName;
    }
   public async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key
        })
        await this.client.send(command)
    }
    public async getFile(key: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: key
        });
        const result = await this.client.send(command);
        const body = result.Body as Readable | undefined;
        if (!body) return Buffer.alloc(0);
        const chunks: Buffer[] = [];
        for await (const chunk of body) chunks.push(Buffer.from(chunk));
        return Buffer.concat(chunks);
    }


   public async uploadfile(file: Express.Multer.File, path: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Body: file.buffer,
            ContentType: file.mimetype,
            Key: `${path}/${new Date().toISOString()}- ${file.originalname}`
        })
        await this.client.send(command);
        return command.input.Key as string;
    }

}
