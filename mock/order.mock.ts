import { defineMock } from 'rspack-plugin-mock/helper'

export default defineMock({
  url: '/api/order/fastorder/status',
  enabled: true,
  method: 'GET',
  body(request) {
    const query = request.query
    const { roleId = 'admin' } = query
    if (roleId !== 'admin') {
      return {
        code: 200,
        message: 'success',
        data: [],
      }
    }
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: 'PENDING',
          name: '预定中',
        },
        {
          id: 'PREPARING',
          name: '预定中',
        },
        {
          id: 'PREPARED',
          name: '预定成功',
        },
        {
          id: 'FAILED',
          name: '预定失败',
        },
        {
          id: 'CANCELLED',
          name: '取消预订',
        },
        {
          id: 'CANCELLING',
          name: '取消申请中',
        },
      ],
    }
  },
})
