import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  item = {},
  onOk,
  amountTotal,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const { balance } = item
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      onOk(data)
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const balanceTotal = () => {
    if (balance != null){
      return balance/100
    }else {
      return amountTotal
    }
  }
  const FormItemById = () => {
    if (balance != null){
      return   <FormItem label="提现金额" hasFeedback {...formItemLayout}>
        {getFieldDecorator('amount', {
          rules: [
            {
              required: true,
              message: '提现金额不能为空!',
            },
          ],
        })(<InputNumber size="large" min={10} max={balance / 100} style={{ width: 200 }} placeholder="请输入金额"/>)}
      </FormItem>
    }
  }
  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="余额" hasFeedback {...formItemLayout}>
          <label>{balanceTotal()}元</label>
        </FormItem>
        {FormItemById()}
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  amountTotal: PropTypes.number,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
