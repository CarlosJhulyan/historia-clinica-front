import React, { useState, useEffect } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text> */}
    </g>
  );
};

const CustomActiveShapePieChart = ({ data }) => {

  const [state, setState] = useState({ activeIndex: 0 });

  // const data = [
  //   { name: 'Normales', value: 100 },
  //   { name: 'UCIM', value: 100 },
  //   { name: 'UCI', value: 100 },
  //   { name: 'Vacías', value: 100 },
  // ];

  useEffect(() => {
    setState({ activeIndex: 0 });
  }, [])

  const onPieEnter = (data, index) => {
    setState({
      activeIndex: index,
    });
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart width={100} height={100}>
        <Pie dataKey="value"
          activeIndex={state.activeIndex}
          activeShape={renderActiveShape}
          onMouseEnter={onPieEnter.bind(this)}
          data={data}
          innerRadius={45}
          outerRadius={65}
          fill="#04B0AD" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CustomActiveShapePieChart

