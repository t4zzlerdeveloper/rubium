import { Client, Account, Databases, Functions,Avatars,Locale,Storage} from 'appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.APPWRITE_URL)
    .setProject(import.meta.env.VITE_PROJECT_ID);

export const locale = new Locale(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
export { ID } from 'appwrite';
