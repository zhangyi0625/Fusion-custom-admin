import { defineMock } from 'rspack-plugin-mock/helper'

export default defineMock([
  {
    url: '/api/business-enquiry/page',
    method: 'GET',
    enabled: true,
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: {
          data: {
            data: [
              {
                id: '3122222',
                projectNo: 'P202507007',
                projectName: '自定义项目名称',
                customer: '青妍红',
                status: '待采购',
                payer: '历茜',
                expectedDate: '2025-07-22',
                projectType: '即期合同',
                price: 1200,
                payType: '文本输入',
                affilateHead: 'string',
                salesman: '0',
                remark: '备注信息',
                created: '2025-07-22 12:00',
                creater: '房云国',
              },
              {
                id: '213213123',
                projectNo: 'P202507007',
                projectName: '自定义项目名称',
                customer: '青妍红',
                business: '历茜',
                status: '中止',
                date: '2025-07-22',
              },
              {
                id: '213213124',
                projectNo: 'P202507007',
                projectName: '自定义项目名称',
                customer: '青妍红',
                business: '历茜',
                status: '已报价',
                date: '2025-07-22',
              },
            ],
            total: 2,
          },
        },
      }
    },
  },
  {
    url: '/api/business-enquiry/product',
    method: 'GET',
    enabled: true,
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: '3122222',
            productNo: 'P202507007',
            productName: '自定义项目名称1',
            productSpecifications: '15mm-银色',
          },
          {
            id: '213213123',
            productNo: 'P202507008',
            productName: '自定义项目名称2',
            productSpecifications: '16mm-银色',
          },
          {
            id: '213213125',
            productNo: 'P202507009',
            productName: '自定义项目名称3',
            productSpecifications: '17mm-银色',
          },
        ],
      }
    },
  },
  {
    url: '/api/business-enquiry/supplier',
    method: 'GET',
    enabled: true,
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: '3122222',
            supplierNo: 'P202507007',
            supplierName: '供应商名称···1',
          },
          {
            id: '213213123',
            supplierNo: 'P202507008',
            supplierName: '供应商名称···2',
          },
          {
            id: '213213125',
            supplierNo: 'P202507009',
            supplierName: '供应商名称···3',
          },
        ],
      }
    },
  },
  {
    url: '/api/business-enquiry/make-quotation',
    method: 'GET',
    enabled: true,
    body(request) {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: '1',
            name: 'ZC-YJV22-0.6/1KV/4*35+1*16',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.3',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '2',
            name: 'ZC-YJV22-0.6/1KV/4*240+1*120',
            unit: '米',
            count: 92,
            price: '874.65',
            pricesSum: '80467.8',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '3',
            name: 'ZCYJV22-0.6/1KV/4*185+1*95',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.3',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '4',
            name: 'ZC-YJV22-0.6/1KV/3*10',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.3',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '5',
            name: 'ZC-YJV22-0.6/1KV/4*35+1*16',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.32',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '6',
            name: 'ZC-YJV22-0.6/1KV/4*240+1*120',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.3',
            changePrice: '',
            changePriceSum: '',
          },
          {
            id: '7',
            name: 'ZC-YJV22-0.6/1KV/4*35+1*16',
            unit: '米',
            count: 96,
            price: '228.42',
            pricesSum: '21928.3',
            changePrice: '',
            changePriceSum: '',
          },
        ],
      }
    },
  },
])
