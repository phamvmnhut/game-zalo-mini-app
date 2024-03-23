import appConfig from "../app-config.json";

export function getConfig<T>(getter: (config: typeof appConfig) => T) {
  return getter(appConfig);
}

export const enum ROUTES {
  ROOT = "/",
  GAME = "/game",
}

export const BE_API = import.meta.env.VITE_BE_API as string;
export const BE_URL = BE_API.split("/api/v1")[0];

export const actionEnum = {
  JOIN: 'join',
  LEAVE: 'leave',
  NEW_JOIN: 'new_join',
  SEND_QUESTION: 'send_question',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  QUESTION_TIMEOUT: 'question_timeout',
  QUESTION_ANSWER_ALL: 'question_answer_all',
  QUESTION_START: 'question_start',
}
