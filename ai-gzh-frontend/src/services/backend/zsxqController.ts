// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** callback GET /api/yu/test/zsxq */
export async function callbackUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponse>('/api/yu/test/zsxq', {
    method: 'GET',
    ...(options || {}),
  });
}
