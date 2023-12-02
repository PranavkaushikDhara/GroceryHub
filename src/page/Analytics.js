import React from 'react'
import AnalyticsCard from '../component/AnalyticsCard'
import analytics from "../assets/analytics.png"
const Analytics = () => {
    return (
        
        <div className='mt-10'>
            <div className="flex flex-wrap gap-5 p-4 justify-center">
                
                <AnalyticsCard name="User Registration Analytics" image={analytics} route="user-registration" ></AnalyticsCard>
                <AnalyticsCard name="Authentication analytics" image={analytics} route="auth-analytics"></AnalyticsCard>
                <AnalyticsCard name="Payment Analytics" image={analytics} route="payment-analytics"></AnalyticsCard>
            </div>
            <div className="flex flex-wrap gap-5 p-4 justify-center">
                <AnalyticsCard name="User Engagement Analytics" image={analytics} route="engagement-analytics"></AnalyticsCard>
                <AnalyticsCard name="Item Purchase analytics" image={analytics} route="purchase-analytics"></AnalyticsCard>
            </div>
        </div>
    )
}

export default Analytics