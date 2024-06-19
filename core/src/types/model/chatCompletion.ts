import { ChatCompletionCreateParamsBase as OpenAiChatCompletionCreateParamsBase } from 'openai/resources/chat/completions'

export interface ChatCompletionCreateParams extends OpenAiChatCompletionCreateParamsBase {
  stream: boolean
}
