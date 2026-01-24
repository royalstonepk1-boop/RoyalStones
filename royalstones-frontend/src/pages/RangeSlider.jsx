import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function RangeSlider({ min = 0, max = 100 ,setCarret }) {
  const [value, setValue] = useState(min);

  const handleChange = (val) => {
    setValue(val);
    setCarret(val);
  };

  return (
    <div style={{ width: 300, margin: "50px auto", textAlign: "center" }}>
      <h3>{value} Carat</h3>
      <div className="flex items-center gap-8">
      <h4  className="ml-[-20px]">{min}</h4>
      <Slider
        min={min}
        max={max}
        value={value}
        step={0.5}
        onChange={handleChange}
        trackStyle={{ backgroundColor: "#4caf50", height: 10 }}
        handleStyle={{
          borderColor: "#4caf50",
          height: 24,
          width: 24,
          marginLeft: -12,
          marginTop: -7,
          backgroundColor: "#fff",
        }}
        railStyle={{ backgroundColor: "#ddd", height: 10 }}
        // Tooltip on handle
        tipFormatter={(val) => `${val}`}
      />
      <h4>{max}</h4>
      </div>
      
    </div>
  );
}
