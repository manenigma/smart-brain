import React from 'react';
import './Boxlist.css';


const Boxlist = ({ box }) => {
	// console.log(box);
	return (
		<div>
			<div className='bounding-box'
				style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}
			></div>
		</div>
		);
}

export default Boxlist;