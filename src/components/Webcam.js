import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useFrequency } from "react-frequency";

// function WebcamComponent({client, camDim, originaImg, depthMap, croppedImg}) {
function WebcamComponent({client, camDim, maxDep, originaImg, depthMap, croppedImg}) {

  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);
  const [videoConstraints, setVideoConstraints] = useState(null);
  const [frequency, setFrequency] = useState(174);
  // const [gain, getGain] = useState(0.3);

  const { toggle, start, stop, playing } = useFrequency({
    hz: frequency,
    // type,
    gain: 1,
    // oscillator
  });

  useEffect(() => {
    var interval = 0
    if(videoConstraints && client){
      interval = setInterval(() => {
        capture()
      }, 100)
    }
    return () => {
      clearTimeout(interval)
    };
  },[videoConstraints, client])

  useEffect(() => {
    if(camDim && camDim.width){
      setVideoConstraints({
        width: camDim.height,
        height: camDim.width,
        facingMode: "environment",
      })
    }
  }, [camDim])

  const capture = () => {
    if(videoConstraints && client){
      const imageSrc = webcamRef.current.getScreenshot();
      client.send(
          JSON.stringify({
          type: "message",
          msg: imageSrc
          })
      );
    }
  };

  useEffect(() => {
    console.log(maxDep)
    if(maxDep > 150){
      setFrequency(100+(parseInt(maxDep)-150)*8)
      // setFrequency(Math.min(0.3+(parseInt(maxDep)-150)/100, 1))
      if(!playing){
        start()
      }
    }
    setTimeout(() => {
      if(maxDep<150){
        setFrequency(0)
      }
    }, 200)
  }, [maxDep]);

  return (
    <div className="Container">
      {
        videoConstraints ? 
        <Webcam
            audio={false}
            mirrored={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />:
          null
      }
      <div>
        {
          maxDep > 150 && maxDep <= 180 ? 
          <h2>Object Detected</h2>: null
        }
        {
          maxDep > 180 && maxDep <= 210 ? 
          <h2>Object Coming Closer</h2>: null
        }
        {
          maxDep > 210? 
          <h2>Alert: Object Very Close</h2>: null
        }
      {
        originaImg ?
        <img src = {originaImg}/> : null
      }
      {
        depthMap ?
        <img src = {depthMap}/> : null
      }
      {
        croppedImg && croppedImg !== "" ?
        <img src = {croppedImg}/> : null 
      }
      </div>
    </div>
    
  );
}

export default WebcamComponent;