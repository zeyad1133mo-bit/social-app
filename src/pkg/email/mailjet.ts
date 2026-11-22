import Mailjet from "node-mailjet";

interface MailjetConfig {
    apiKey: string;
    apiSecret: string;
    fromName: string;
    fromEmail: string;
}

export class MailjetProvider {
    client: Mailjet;
    fromEmail: string;
    fromName: string;

    constructor(config: MailjetConfig) {
        this.client = new Mailjet({
            apiKey: config.apiKey, apiSecret: config.apiSecret,
        });
        this.fromName = config.fromName;
        this.fromEmail = config.fromEmail;
    }

    async sendMail(email: string, subject: string, html: string) {

        await this.client.post('send', {version: 'v3.1'}).request({
            Messages: [{
                From: {
                    Email: this.fromEmail, Name: this.fromName,
                }, To: [{
                    Email: email,
                },], Subject: subject,
                HTMLPart: html
            },],
        });
    }
}
