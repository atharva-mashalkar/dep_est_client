import React, { useEffect,  useState} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';
import WebcamComponent from './components/Webcam';

function App() {

  const [camDim, setCamDim] = useState(null)
  const [users, setUsers] = useState(null);
  const [originalImg, setOriginalImg] = useState(null)
  const [depthMap, setDepthMap] = useState(null)
  const [croppedImg, setCroppedImg] = useState(null)
  const [maxDep, setMaxDep] = useState(null)

  let certPath = "/home/atharva/Documents/DDP/DepthEstimation/website/client/cert.pem"

  useEffect(() => {
    //Connecting to the server
    const client = new W3CWebSocket('wss://server.walkbuddy.in');
    // console.log(client)
    // const client = new W3CWebSocket('ws://0.tcp.in.ngrok.io:11856')
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      setUsers(client);
    };
    //Receiving camera dimentions
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("Got Reply!");
      if(dataFromServer && dataFromServer.Height != null){
        setCamDim({height:dataFromServer.Height, width:dataFromServer.Width})
      }
      if(dataFromServer && dataFromServer.maxHeat){
        setMaxDep(dataFromServer.maxHeat)
      }
      if(dataFromServer && dataFromServer.originaImg){
        setOriginalImg(dataFromServer.originaImg)
        setDepthMap(dataFromServer.depthMap)
        setCroppedImg(dataFromServer.croppedImg)
      }
    };
    // Close socket on unmount:
    return () => client.close();
  }, [])

  return (
    <div className="App">
      {/* <WebcamComponent client = {users} camDim = {camDim} originaImg={originalImg} depthMap={depthMap} croppedImg={croppedImg}/> */}
      <WebcamComponent client = {users} camDim = {camDim} maxDep = {maxDep} originaImg={originalImg} depthMap={depthMap} croppedImg={croppedImg}/>
    </div>
  );
}

export default App;
