import nodemailer, { Transporter } from "nodemailer";
interface nodeMailerConfig {
    host: string;
    port: number;
    user: string;
    pass: string;
    fromName: string;
    fromEmail: string;
}

export class NodeMailerProvider {
    
    private readonly client: Transporter;
    private readonly fromEmail: string;
    private readonly fromName: string;

    constructor(config: nodeMailerConfig) {
        this.client = nodemailer.createTransport({
            host : config.host,
            port : config.port,
            secure : false,
            auth : {
                user : config.user,
                pass : config.pass
            }
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }

    async sendMail(email: string, subject: string, html: string) {
        await this.client.sendMail({
            from: {
                name: this.fromName,
                address: this.fromEmail,
            },
            to: email,
            subject: subject,
            html: html,
        });
    }
}
