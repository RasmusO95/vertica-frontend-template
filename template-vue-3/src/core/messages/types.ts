export enum ClientMessageType {
    Error = 0,
    Warning = 1,
    Info = 2
}

export interface ClientMessage {
    message: string,
    messageType: ClientMessageType,
    errorId: string
}

export interface ClientMessageWithError {
    errorId: string,
    messages: ClientMessage[]
}

export const ValidationErrorEventKey = 'ValidationError';
export const GeneralErrorEventKey = 'GeneralError';

export interface ValidationErrorEvent {
    errorId: string;
    messagesId: string;
    messages: ClientMessage[];
    handled: () => void;
}
