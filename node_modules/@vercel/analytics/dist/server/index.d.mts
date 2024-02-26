type Mode = 'auto' | 'development' | 'production';
type AllowedPropertyValues = string | number | boolean | null;
declare global {
    interface Window {
        va?: (event: 'beforeSend' | 'event' | 'pageview', properties?: unknown) => void;
        vaq?: [string, unknown?][];
        vai?: boolean;
        vam?: Mode;
    }
}

type HeadersObject = Record<string, string | string[] | undefined>;
type AllowedHeaders = Headers | HeadersObject;
interface ContextWithRequest {
    request: {
        headers: AllowedHeaders;
    };
}
interface ContextWithHeaders {
    headers: AllowedHeaders;
}
type Context = ContextWithRequest | ContextWithHeaders;
declare function track(eventName: string, properties?: Record<string, AllowedPropertyValues>, context?: Context): Promise<void>;

export { track };
