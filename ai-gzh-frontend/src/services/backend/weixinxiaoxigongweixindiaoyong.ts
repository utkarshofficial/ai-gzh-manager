// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 微信服务器的认证消息 公众号接入开发模式时腾讯调用此接口 GET /api/wx/msg/${param0} */
export async function authGetUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.authGetUsingGETParams,
  options?: { [key: string]: any },
) {
  const { appId: param0, ...queryParams } = params;
  return request<string>(`/api/wx/msg/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  });
}

/** 微信各类消息 公众号接入开发模式后才有效 POST /api/wx/msg/${param0} */
export async function postUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postUsingPOSTParams,
  body: string,
  options?: { [key: string]: any },
) {
  const { appId: param0, ...queryParams } = params;
  return request<string>(`/api/wx/msg/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...queryParams,
    },
    data: body,
    ...(options || {}),
  });
}
