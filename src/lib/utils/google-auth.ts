import {AppError} from "../error/app-error";
import {env} from "../config/env";
import {OAuth2Client} from 'google-auth-library';

const client = new OAuth2Client();




export async function verifyGoogleToken(idToken:string) {
    try {
        const ticket = await  client.verifyIdToken({
            idToken: idToken,
            audience: [env.google.webClientId,env.google.iosClientId]
        });
        return ticket.getPayload();// {id,name,email,pp,...}
    } catch (err) {
        throw new AppError('invalid google token', 403);
    }
}