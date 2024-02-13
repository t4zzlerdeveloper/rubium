import { Client, Account, Databases, Functions,Avatars,Locale} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);
export const locale = new Locale(client);
export { ID } from 'appwrite';
