import { useState } from "react";
// import Webcam from "react-webcam";
import { Webcam } from "./Webcam";

function App() {
  const [option, setOption] = useState<number>(4);
  return (
    <div className="w-4xl mx-auto">
      <h1 className="text-4xl">photobox</h1>
      <div className="bg-zinc-300 flex gap-12">
        <div className="bg-red-300 w-full p-8">
          <div className="mx-auto bg-slate-400 w-full aspect-square">
            {/* <WebcamCapture /> */}
            <Webcam />
          </div>
          <button className="px-4 py-2 bg-blue-300">capture</button>
        </div>
        <div className="bg-green-300 p-4 w-full">
          <h3>photo preview</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="w-full aspect-square bg-slate-100"></div>
            <div className="w-full aspect-square bg-slate-100"></div>
            <div className="w-full aspect-square bg-slate-100"></div>
            <div className="w-full aspect-square bg-slate-100"></div>
          </div>
          <h3>options</h3>
          <div className="flex justify-between px-4 bg-amber-200">
            <button onClick={() => setOption((prev) => prev - 1)}>-</button>
            <p>{option}</p>
            <button onClick={() => setOption((prev) => prev + 1)}>+</button>
          </div>
          <div className="">
            <p>Timer</p>
            <select name="timer" id="timer" className="w-full bg-white px-8">
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
          <button className="w-full text-center bg-amber-300">
            Print your photos
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

// const videoConstraints = {
//   width: 1280,
//   height: 720,
//   facingMode: "user",
// };
// const WebcamCapture = () => (
//   <Webcam
//     audio={false}
//     height={720}
//     screenshotFormat="image/jpeg"
//     width={1280}
//     videoConstraints={videoConstraints}
//   >
//     {({ getScreenshot }) => (
//       <button
//         onClick={() => {
//           const imageSrc = getScreenshot();
//         }}
//       >
//         Capture photo
//       </button>
//     )}
//   </Webcam>
// );
