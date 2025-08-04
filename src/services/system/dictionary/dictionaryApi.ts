import { HttpRequest } from '@/utils/request'
import type {
  SysDictionaryClassType,
  SysDictionaryParams,
  SysDictionaryType,
} from './dictionaryModel'

/**
 * 枚举角色相关的api
 */
export enum DictionaryApi {
  dictionary = '/system/dictionary',
  dictionaryByPage = '/system/dictionary/page',
  dictionaryById = '/system/dictionary-data',
  dictionaryByIdPage = '/system/dictionary-data/page',
  batchDeleteDictionaryById = '/system/dictionary-data/batch',
}

/**
 * 分页获取字典分类列表
 * @param params 字典参数
 * @returns 字典分类列表
 */
export const getDictionaryListByPage = (params?: SysDictionaryClassType) => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionaryByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 获取字典分类列表
 * @param params 字典参数
 * @returns 字典分类列表
 */
export const getDictionaryList = (params?: SysDictionaryClassType) => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionary,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加字典分类
 * @param params 字典参数
 * @returns
 */
export const addDictionary = (params: SysDictionaryClassType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.dictionary,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新字典分类
 * @param params 字典参数
 * @returns
 */
export const updateDictionary = (params: SysDictionaryClassType) => {
  return HttpRequest.put(
    {
      url: DictionaryApi.dictionary,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除字典分类
 * @param id
 * @returns
 */
export const deleteDictionary = (id: string) => {
  return HttpRequest.delete(
    {
      url: DictionaryApi.dictionary + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 分页查询字典项
 * @param id
 * @returns
 */
export const getDictionaryListByIdPage = (
  params: Partial<SysDictionaryParams>
) => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionaryByIdPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 查询全部字典项
 * @returns
 */
export const getDictionaryListById = () => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionaryById,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加字典项
 * @param params 字典参数
 * @returns
 */
export const addDictionaryById = (params: SysDictionaryType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.dictionaryById,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新字典项
 * @param params 字典参数
 * @returns
 */
export const updateDictionaryById = (params: SysDictionaryType) => {
  return HttpRequest.put(
    {
      url: DictionaryApi.dictionaryById,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除字典项
 * @param id
 * @returns
 */
export const deleteDictionaryById = (id: string) => {
  return HttpRequest.delete(
    {
      url: DictionaryApi.dictionaryById + '/' + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量删除字典项
 * @param params 字典参数
 * @returns
 */
export const batchDeleteDictionaryById = (params: { ids: string[] }) => {
  return HttpRequest.delete(
    {
      url: DictionaryApi.batchDeleteDictionaryById,
      data: params.ids,
    },
    {
      successMessageMode: 'none',
    }
  )
}
