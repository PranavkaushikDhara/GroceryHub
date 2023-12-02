import React from 'react'
import { Link } from 'react-router-dom'
const AnalyticsCard = ({image,name,route}) => {
  return (
    <div className='bg-red-200'> 
        <Link to={'/'+route} onClick={()=>window.scrollTo({top:"0",behavior : "smooth"})} >
          <div className="min-w-40 min-h-[150px]">
            <img src={image} className="h-full w-full" />
          </div>
          <h3 className="font-semibold text-slate-600 text-center capitalize text-lg">
            {name}
          </h3>
          </Link>
    </div>
  )
}

export default AnalyticsCard