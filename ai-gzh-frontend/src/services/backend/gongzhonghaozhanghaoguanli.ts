// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据appId删除列表，这样后端处理更方便 POST /api/wx/account/delete */
export async function deleteUsingPost(body: string[], options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/wx/account/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 公众号详情 GET /api/wx/account/info/${param0} */
export async function infoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.infoUsingGETParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseWxAccountVO_>(`/api/wx/account/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询公众号 GET /api/wx/account/page */
export async function pageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageWxAccountVO_>('/api/wx/account/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增公众号 POST /api/wx/account/save */
export async function saveUsingPost(body: API.WxAccountAddDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/wx/account/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取一个随机的32位token GET /api/wx/account/token */
export async function getTokenUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/wx/account/token', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新公众号信息 POST /api/wx/account/update */
export async function updateUsingPost(
  body: API.WxAccountUpdateDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/wx/account/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
