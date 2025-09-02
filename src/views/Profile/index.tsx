import { useState } from 'react'
import { ProfileOptions, ProfileOptionsType } from './config'
import EditProfile from './EditProfile'

const Profile: React.FC = () => {
  const [params, setParams] = useState<{ visible: boolean; type: string }>({
    visible: false,
    type: '',
  })
  const editInfo = (item: ProfileOptionsType) => {
    setParams({ visible: true, type: item.editType as string })
  }

  const confirm = () => {}
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
              <div className="ml-[20px]">{item.label}</div>
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
