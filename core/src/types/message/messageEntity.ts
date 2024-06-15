import { Message as OpenAiMessage } from 'openai/resources/beta/threads/messages'
import { ChatCompletionMessage } from '../inference'
import { ModelInfo } from '../model'
import { Thread } from '../thread'

export interface ThreadMessage extends OpenAiMessage {}

/**
 * The `MessageRequest` type defines the shape of a new message request object.
 * @data_transfer_object
 */
export type MessageRequest = {
  id?: string

  /**
   * @deprecated Use thread object instead
   * The thread id of the message request.
   */
  threadId: string

  /**
   * The assistant id of the message request.
   */
  assistantId?: string

  /** Messages for constructing a chat completion request **/
  messages?: ChatCompletionMessage[]

  /** Settings for constructing a chat completion request **/
  model?: ModelInfo

  /** The thread of this message is belong to. **/
  // TODO: deprecate threadId field
  thread?: Thread

  type?: string
}

/**
 * The status of the message.
 * @data_transfer_object
 */
export enum MessageStatus {
  /** Message is fully loaded. **/
  Ready = 'ready',
  /** Message is not fully loaded. **/
  Pending = 'pending',
  /** Message loaded with error. **/
  Error = 'error',
  /** Message is cancelled streaming */
  Stopped = 'stopped',
}

export enum ErrorCode {
  InvalidApiKey = 'invalid_api_key',

  InsufficientQuota = 'insufficient_quota',

  InvalidRequestError = 'invalid_request_error',

  Unknown = 'unknown',
}

/**
 * The content type of the message.
 */
export enum ContentType {
  Text = 'text',
  Image = 'image',
  Pdf = 'pdf',
}

/**
 * The `ContentValue` type defines the shape of a content value object
 * @data_transfer_object
 */
export type ContentValue = {
  value: string
  annotations: string[]
  name?: string
  size?: number
}

/**
 * The `ThreadContent` type defines the shape of a message's content object
 * @data_transfer_object
 */
export type ThreadContent = {
  type: ContentType
  text: ContentValue
}
