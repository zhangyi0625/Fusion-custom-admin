import React, { memo, useEffect, useState } from 'react'
import DragModal from '@/components/modal/DragModal'
import { CargoReuirementOptions } from './config'

interface CargoRequirementProps {
  params: {
    visible: boolean
    editRow: any
  }
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const CargoRequirement: React.FC<CargoRequirementProps> = memo(
  ({ params, onCancel }) => {
    const [loading, setLoading] = useState<boolean>(true)

    const [options, setoptions] = useState(CargoReuirementOptions)

    useEffect(() => {
      if (!params.visible) return
      getOptionsByCarrier(params.editRow?.bookingInfo, params.editRow?.carrier)
    }, [params.visible])

    const getOptionsByCarrier = (options: any, carrier: string) => {
      let arr = CargoReuirementOptions.filter((ele) =>
        ele.includeCarrier.includes(carrier)
      )
      arr.map((item) => {
        item.value = item.replaceFn
          ? item.replaceFn(options[item.key])
          : options[item.key]
      })
      setoptions(arr)
      setLoading(false)
    }

    return (
      <DragModal
        title="补充资料"
        width={'480px'}
        open={params.visible}
        loading={loading}
        onCancel={onCancel}
        footer={null}
      >
        {options.map((item, index) => (
          <div
            className="flex items-center justify-between my-[10px]"
            key={index}
          >
            <p className="text-light-grey">{item.label}</p>
            <p className="text-dull-grey">{item.value}</p>
          </div>
        ))}
      </DragModal>
    )
  }
)

export default CargoRequirement
