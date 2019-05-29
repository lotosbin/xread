import React, {useState} from 'react';
import Slider from '@material-ui/lab/Slider';

type P = {
    onChange: ?((value)=>{})
}

function ScoreSlider(props: P) {
    const {defaultScore, onChange} = props;
    const [score, setScore] = useState((defaultScore || 0.8) * 100);
    return (
        <Slider
            value={score}
            aria-labelledby="label"
            onChange={(e, value) => {
                setScore(value);
                onChange && onChange(value / 100.0)
            }}
        />
    );
}

export default ScoreSlider;