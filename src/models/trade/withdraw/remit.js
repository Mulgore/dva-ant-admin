import modelExtend from 'dva-model-extend'
import { query, autoById, autoAll } from '../../../services/trade/withdraw/remit'
import { pageModel } from '../../common'
import { config } from 'utils'
import { message } from 'antd'


export default modelExtend(pageModel, {

  namespace: 'remit',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'autoAll',
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/remit') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
              amountTotal: data.amountTotal,
            },
          },
        })
      } else {
        throw data
      }
    },

    * autoById ({ payload }, { select, call, put }) {
      const id = yield select(({ remit }) => remit.currentItem.id)
      const editRemit = { ...payload, id }
      const data = yield call(autoById, editRemit)
      if (data.success) {
        message.success(data.message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * autoAll ({ payload }, { call, put }) {
      const data = yield call(autoAll, payload)
      if (data.success) {
        message.success(data.message)
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },


  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

  }
  ,
})
