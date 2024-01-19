// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** add GET /api/chart/add */
export async function addUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/chart/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** get GET /api/chart/get */
export async function getUsingGET(options?: { [key: string]: any }) {
  return request<string>('/api/chart/get', {
    method: 'GET',
    ...(options || {}),
  });
}
