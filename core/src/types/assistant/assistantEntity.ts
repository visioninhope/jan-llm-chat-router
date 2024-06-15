import {
  AssistantTool as OpenAiAssistantTool,
  Assistant as OpenAiAssistant,
} from 'openai/resources/beta/assistants'

export type AssistantTool = OpenAiAssistantTool & { enabled?: boolean }

export interface Assistant extends OpenAiAssistant {
  avatar?: string
}
