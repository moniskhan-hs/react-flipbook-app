import { useState } from 'react';
import { HexColorPicker } from "react-colorful";
const ColorsPicker = () => {
    const [color, setColor] = useState("#aabbcc");
    return <HexColorPicker color={color} onChange={setColor} />;
  
}

export default ColorsPicker
