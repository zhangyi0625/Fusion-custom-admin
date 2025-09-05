import React from 'react'

export type LoginByEditPasswordProps = {
  onSave: (params: any) => void
}

const LoginByEditPassword: React.FC<LoginByEditPasswordProps> = ({
  onSave,
}) => {
  return (
    <Form
      form={form}
      name="login"
      labelCol={{ span: 5 }}
      size="large"
      autoComplete="off"
      onFinish={submit}
      colon={false}
      initialValues={{
        remember: true,
      }}
    ></Form>
  )
}

export default LoginByEditPassword
