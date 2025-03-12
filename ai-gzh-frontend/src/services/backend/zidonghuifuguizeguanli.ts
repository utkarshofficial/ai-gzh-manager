// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 根据id删除列表 POST /api/wx/reply/delete */
export async function deleteUsingPost1(body: number[], options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/wx/reply/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取回复内容类型 GET /api/wx/reply/get/content/type */
export async function getContentTypeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseArrayWxReplyContentTypeEnum_>('/api/wx/reply/get/content/type', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取关键字匹配类型 GET /api/wx/reply/get/match/type */
export async function getMatchTypeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseArrayWxReplyMatchTypeEnum_>('/api/wx/reply/get/match/type', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取回复规则类型 GET /api/wx/reply/get/reply/type */
export async function getReplyTypeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseArrayWxReplyRuleTypeEnum_>('/api/wx/reply/get/reply/type', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 回复规则详情 GET /api/wx/reply/info/${param0} */
export async function infoUsingGet1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.infoUsingGET1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseResponseWxReplyRuleVO_>(`/api/wx/reply/info/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 分页查询回复规则 GET /api/wx/reply/page */
export async function pageUsingGet1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pageUsingGET1Params,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageWxReplyRuleVO_>('/api/wx/reply/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增回复规则 POST /api/wx/reply/save */
export async function saveUsingPost1(
  body: API.WxReplyRuleAddDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/wx/reply/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新回复规则 POST /api/wx/reply/update */
export async function updateUsingPost1(
  body: API.WxReplyRuleUpdateDTO,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/wx/reply/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
