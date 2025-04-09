import { useRef, useState } from "react";

function App() {
  const [option, setOption] = useState<number>(4);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // ====== WEBCAM Functions ====== //
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMediaStream(stream);
    } catch (error) {
      console.error("Error accessing webcam", error);
    }
  };

  // Function to stop the webcam
  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      setMediaStream(null);
    }
    // reset the video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || capturedPhotos.length >= 4) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame onto canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");

      // Set the captured image
      setCapturedPhotos((prev) => [...prev, imageDataUrl].slice(0, 4));
    }
  };
  // ====== WEBCAM Functions ====== //

  const handleDeletePhoto = (index: number) => {
    setCapturedPhotos((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl text-center my-8">photobox</h1>
      <div className="bg-zinc-300 flex gap-12">
        <div className="bg-red-300 w-full p-8">
          {/* WEBCAM */}
          <div className="flex justify-between">
            <button
              className="px-2 py-1 text-xs bg-white cursor-pointer"
              onClick={startWebcam}
            >
              Start Webcam
            </button>
            <button
              className="px-2 py-1 text-xs bg-white cursor-pointer"
              onClick={stopWebcam}
            >
              Close Webcam
            </button>
          </div>
          <div className="mx-auto bg-slate-400 w-full aspect-square">
            <video
              className="w-full h-full object-cover -scale-x-100"
              ref={videoRef}
              autoPlay
              muted
            />
          </div>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-300 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              onClick={captureImage}
              disabled={!mediaStream || capturedPhotos.length >= 4}
            >
              Capture
            </button>
            {/* WEBCAM */}
          </div>
        </div>

        <div className="bg-green-300 p-4 w-full">
          <h3>photo preview</h3>
          <div className="grid grid-cols-4 gap-4 mb-8 mt-3">
            {[0, 1, 2, 3].map((index) => {
              const photo = capturedPhotos[index];

              return (
                <div
                  key={index}
                  className="relative w-full aspect-square border border-gray-300 bg-gray-100 flex items-center justify-center"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt={`Captured ${index + 1}`}
                        className="w-full h-full object-cover -scale-x-100"
                      />
                      <button
                        onClick={() => handleDeletePhoto(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Empty</span>
                  )}
                </div>
              );
            })}
          </div>
          <h3>options</h3>
          <div className="flex justify-between px-2 bg-amber-200 mt-3 mb-8 py-2 rounded-2xl">
            <button
              className="cursor-pointer hover:bg-amber-400 px-2 rounded-[10px] transition-all duration-100"
              onClick={() => setOption((prev) => prev - 1)}
            >
              -
            </button>
            <p>{option}</p>
            <button
              className="cursor-pointer hover:bg-amber-400 px-2 rounded-[10px] transition-all duration-100"
              onClick={() => setOption((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <div className="">
            <p>Timer</p>
            <select
              name="timer"
              id="timer"
              className="w-full bg-white px-8 py-2 mt-3 mb-8 rounded-2xl"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
          <button className="w-full text-center bg-amber-300 py-2 rounded-2xl cursor-pointer hover:bg-amber-500 transition-all duration-200">
            Print your photos
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
