import React from 'react';
import Boxlist from './Boxlist';

const FaceRecognition = ({ imageUrl, boxes }) => {
	return (
		<div className='center'>
			<div className="absolute mt2">
				<img id='inputImage' src={imageUrl} alt="" width='500px' height='auto'/>
				{
					boxes.map((box, i) => <Boxlist box={box} key={i}/>)
				}
			</div>
		</div>
	);
}

export default FaceRecognition