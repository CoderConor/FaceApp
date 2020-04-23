import React from 'react';

//imageUrl defined in app.js, passed as prop. Can enter any image url link
const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className='center'>
        <img alt='' src={imageUrl}/>
      </div>
    );
}

export default FaceRecognition;