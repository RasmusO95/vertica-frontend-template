import bus from '@/core/bus';
import dictionaryService from '@/core/dictionary/dictionary.service';
import { ClientMessage, ClientMessageType, ClientMessageWithError, GeneralErrorEventKey, ValidationErrorEvent, ValidationErrorEventKey } from '@/core/messages/types';
import { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';

export default (response: AxiosResponse) => {
    const errorId = response.data?.correlationId as string;
    const messages = response.data?.validationMessages as ClientMessage[];
    if (messages) {
        // Validation-messages received. If a messagesId is included (from a post) forward messages to local handler
        // If no messagesId or no one wanted to handle, show globally.
        const messagesId: string | undefined = response.config?.messagesId;
        let isHandled = false;
        if (messagesId) {
            bus.emit(ValidationErrorEventKey, {
                errorId: errorId,
                messages: messages,
                messagesId: messagesId,
                handled: () => (isHandled = true),
            } as ValidationErrorEvent);
        }

        if (!isHandled) {
            bus.emit(GeneralErrorEventKey, { messages, errorId } as ClientMessageWithError);
        }
    } else if (isErrorStatusCode(response.status)) {
        // Got raw error without messages in the "normal" validationMessages prop - handle that as well. Translate if label.
        const rawTxt = response.data;
        const message = dictionaryService.exists(rawTxt) ? dictionaryService.get(rawTxt) : rawTxt;
        bus.emit(GeneralErrorEventKey, [{
            message: message,
            messageType: ClientMessageType.Error,
        }]);
    }
    return response;

    function isErrorStatusCode(statusCode: number): boolean {
        return [HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.BAD_GATEWAY].includes(statusCode);
    }
};
