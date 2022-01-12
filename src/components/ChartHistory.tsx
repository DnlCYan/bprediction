import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const ChartHistory = (dataArray: any) => {

  return (
    <div>
        <LineChart
          width={500}
          height={300}
          data={dataArray.dataArray}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"  interval="preserveEnd" />
          <YAxis allowDataOverflow interval="preserveEnd" domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip />
          {/* <Legend /> */}
          {/* <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} /> */}
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
    </div>
  )
}

export default ChartHistory