import { Model as OpenAiModel } from 'openai/resources'

/**
 * Represents the information about a model.
 * @stored
 */
export type ModelInfo = {
  id: string
  settings: ModelSettingParams
  parameters: ModelRuntimeParams
  engine?: InferenceEngine
}

/**
 * Represents the inference engine.
 * @stored
 */

export enum InferenceEngine {
  anthropic = 'anthropic',
  mistral = 'mistral',
  martian = 'martian',
  openrouter = 'openrouter',
  cortexLlamacpp = 'cortex.llamacpp',
  openai = 'openai',
  groq = 'groq',
  triton_trtllm = 'triton_trtllm',
  nitro_tensorrt_llm = 'nitro-tensorrt-llm',
  cohere = 'cohere',
  cortex = 'cortex',
}

export type ModelArtifact = {
  filename: string
  url: string
}

/**
 * Model type defines the shape of a model object.
 * @stored
 */
export interface Model extends OpenAiModel {
  ctx_len?: number
  ngl?: number
  embedding?: boolean
  n_parallel?: number
  cpu_threads?: number
  prompt_template?: string
  system_prompt?: string
  ai_prompt?: string
  user_prompt?: string
  llama_model_path?: string
  mmproj?: string
  cont_batching?: boolean
  vision_model?: boolean
  text_model?: boolean
  temperature?: number
  token_limit?: number
  top_k?: number
  top_p?: number
  stream?: boolean
  max_tokens?: number
  stop?: string[]
  frequency_penalty?: number
  presence_penalty?: number
  engine: InferenceEngine

  metadata?: ModelMetadata
}

export type ModelMetadata = Record<
  'author' | 'tags' | 'size' | 'cover',
  string | string[] | number | string
>

/**
 * The available model settings.
 */
export type ModelSettingParams = {
  ctx_len?: number
  ngl?: number
  embedding?: boolean
  n_parallel?: number
  cpu_threads?: number
  prompt_template?: string
  system_prompt?: string
  ai_prompt?: string
  user_prompt?: string
  llama_model_path?: string
  mmproj?: string
  cont_batching?: boolean
  vision_model?: boolean
  text_model?: boolean
}

/**
 * The available model runtime parameters.
 */
export type ModelRuntimeParams = {
  temperature?: number
  token_limit?: number
  top_k?: number
  top_p?: number
  stream?: boolean
  max_tokens?: number
  stop?: string[]
  frequency_penalty?: number
  presence_penalty?: number
  engine?: string
}

export type ModelInitFailed = Model & {
  error: Error
}
