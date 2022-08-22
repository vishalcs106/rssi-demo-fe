import "./App.css";
import io from "socket.io-client";
import { useReducer, useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import KalmanFilter from "./Kalman";

const socket = io.connect("http://localhost:3001");







const kf = new KalmanFilter({ R: 0.1, Q: 60 });

function reducer(state, action) {
  switch (action.type) {
    case "raw": {
      const result1 = { rawRssi: action.value, filteredRssi: null, androidFiltered: null };
     // console.log("Resule raw " + JSON.stringify(result1));
      return result1;
    }

    case "filtered": {
      const result2 = { rawRssi: null, filteredRssi: kf.filter(action.value), androidFiltered: null };
      //console.log("Resule Filt " + JSON.stringify(result2));
      return result2;
    }
    case "android_filtered": {
      const result3 = { rawRssi: null, filteredRssi: null, androidFiltered: action.value };
      console.log("Resule Filt " + JSON.stringify(result3));
      return result3;
    }
    default:
      return state;
  }
}

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

function getRandomInt() {
  const min = Math.ceil(45);
  const max = Math.floor(85);
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

const [state, dispatch] = useReducer(reducer, {
    rawRssi: 0,
    filteredRssi: 0,
    androidFiltered: 0
  });

  const random = async (rawRssi, androidKf) => {
    dispatch({ type: "raw", value: rawRssi });
    await timeout(100);
    dispatch({ type: "filtered", value: rawRssi });
    await timeout(100)
    dispatch({type: "android_filtered", value: androidKf})
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {

    socket.emit("join_room", "123");

    socket.on("receive_message", (data) => {
    //  console.log("receive_message" + JSON.stringify(data));
      random(data.message, data.and_kf)
    });
  }, [socket]);
  return (
    <div className="App">
      
      <ChartComponent
        rssi={state.rawRssi}
        filtered={state.filteredRssi}
        androidFiltered={state.androidFiltered}
      ></ChartComponent>
    </div>
  );
}

export default App;