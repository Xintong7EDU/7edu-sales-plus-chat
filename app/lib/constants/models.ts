/**
 * Constants for AI models used in the application
 */

export const TOGETHER_AI_MODELS = {
//   LLAMA_3_70B: 'meta-llama/Llama-3-70b-chat-hf',
  LLAMA_3_8B: 'meta-llama/Llama-3-8b-chat-hf',
  LLAMA_3_INSTRUCT: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  MIXTRAL: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  QWEN: 'Qwen/Qwen2-VL-72B-Instruct',
  COMMAND_R: 'CohereForAI/c4ai-command-r-v01',
  SOLAR: 'upstage/SOLAR-10.7B-Instruct-v1.0',
  DEEPSEEK_V3: 'deepseek-ai/DeepSeek-V3',
  DEEPSEEK_R1: 'deepseek-ai/DeepSeek-R1'
};

export const DEFAULT_TOGETHER_AI_MODEL = TOGETHER_AI_MODELS.LLAMA_3_INSTRUCT; 