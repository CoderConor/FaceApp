import React from 'react';

//imageUrl defined in app.js, passed as prop. Can enter any image url link
const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className='center ma'>
        <div className='absolute mt2'>
        <img alt='' src={imageUrl} width='500px' height='auto'/>
        </div>
      </div>
    );
}

export default FaceRecognition;