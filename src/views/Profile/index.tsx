import { useEffect, useState } from 'react'
import { App } from 'antd'
import { ProfileOptions, ProfileOptionsType } from './config'
import EditProfile from './EditProfile'
import {
  getSupplerAccountInfo,
  updatePassword,
} from '@/services/login/loginApi'
import type { ResetLoginPasswordType } from '@/services/login/loginModel'

const Profile: React.FC = () => {
  const { message } = App.useApp()

  const [params, setParams] = useState<{ visible: boolean; type: string }>({
    visible: false,
    type: '',
  })

  const [profileInfo, setProfileInfo] = useState(ProfileOptions)

  const editInfo = (item: ProfileOptionsType) => {
    setParams({ visible: true, type: item.editType as string })
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const resp = await getSupplerAccountInfo()
    profileInfo.map((item) => {
      if (resp[item.key]) item.value = resp[item.key]
    })
    setProfileInfo(profileInfo)
  }

  const confirm = (currentRow: ResetLoginPasswordType) => {
    updatePassword(currentRow).then(() => {
      message.success('修改密码成功')
      setParams({ visible: false, type: '' })
    })
  }
  return (
    <>
      <div className="bg-white rounded-[6px] w-[1200px] relative mx-auto mt-[10px]">
        {ProfileOptions.map((item) => (
          <div
            className="flex items-center justify-between py-[24px] ml-[24px]"
            style={{ borderBottom: '1px solid #F0F0F0' }}
            key={item.label}
          >
            <div className="flex items-center">
              <p className="text-gray-400 font-normal w-[120px]">
                {item.label}
              </p>
              <div className="ml-[20px]">
                {item.key === 'password' ? '***********' : item.value}
              </div>
            </div>
            {item.isEdit && (
              <div
                className="text-blue-500 mr-[24px] cursor-pointer"
                onClick={() => editInfo(item)}
              >
                {item.editText ?? '修改'}
              </div>
            )}
          </div>
        ))}
      </div>
      <EditProfile
        params={params}
        onCancel={() => setParams({ visible: false, type: '' })}
        onOk={confirm}
      />
    </>
  )
}

export default Profile
