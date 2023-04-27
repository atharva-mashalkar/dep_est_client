import React, { useEffect,  useState} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';
import WebcamVideo from './components/Webcam';

function App() {

  const client = new W3CWebSocket('ws://127.0.0.1:8000');

  useEffect(() => {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("Got Reply! ", dataFromServer);
    };
  }, [])

  return (
    <div className="App">
      <WebcamVideo client = {client}/>
    </div>
  );
}

export default App;
