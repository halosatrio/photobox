import { useRef, useState } from "react";

function App() {
  const [option, setOption] = useState<number>(4);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

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
    if (!videoRef.current || capturedPhotos.length >= option || isCountingDown)
      return;

    const video = videoRef.current;

    if (timer === 0) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; // 640
      canvas.height = video.videoHeight; // 480

      // Draw video frame onto canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/png");
        // Set the captured image
        setCapturedPhotos((prev) => [...prev, imageDataUrl].slice(0, option));
      }
    } else {
      setIsCountingDown(true);
      let counter = timer;
      setCountdown(counter);

      // capture with timer
      const countdownInterval = setInterval(() => {
        counter--;
        setCountdown(counter);

        if (counter === 0) {
          clearInterval(countdownInterval);
          setCountdown(null);
          setIsCountingDown(false);

          // Set canvas dimensions to match video stream
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw video frame onto canvas
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataUrl = canvas.toDataURL("image/png");
            // Set the captured image
            setCapturedPhotos((prev) =>
              [...prev, imageDataUrl].slice(0, option)
            );
          }
        }
      }, 1000);
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

  // ====== PRINT PHOTOS Functions ====== //
  const handleDownloadCollage = async () => {
    const images = await Promise.all(
      capturedPhotos.map((src) => loadImage(src))
    );

    const imgWidth = 640;
    const imgHeight = 480;
    const cols = 2;
    const rows = Math.ceil(images.length / cols);

    const canvas = document.createElement("canvas");
    canvas.width = cols * imgWidth;
    canvas.height = rows * imgHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    images.forEach((img, index) => {
      const x = (index % cols) * imgWidth;
      const y = Math.floor(index / cols) * imgHeight;
      ctx.save();
      // Move the origin to the right edge of the image's drawing area
      ctx.translate(x + imgWidth, y);
      // Flip horizontally
      ctx.scale(-1, 1);
      // Draw the image with flipped context, at the new origin (0,0)
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      ctx.restore();
    });

    const jpgData = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = jpgData;
    link.download = "photo-collage.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  // ====== PRINT PHOTOS Functions ====== //

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl text-center my-8">photobox</h1>
      <div className="bg-zinc-300 flex ">
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
          <div className="relative mx-auto bg-slate-400 w-full aspect-3/2">
            <video
              className="w-full h-full object-cover -scale-x-100"
              ref={videoRef}
              autoPlay
              muted
            />
            {countdown !== null && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black opacity-40 z-10">
                <span className="text-white text-6xl font-bold">
                  {countdown}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-300 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              onClick={captureImage}
              disabled={!mediaStream || capturedPhotos.length >= option}
            >
              Capture
            </button>
            {/* WEBCAM */}
          </div>
        </div>

        <div className="bg-green-300 p-4 w-full">
          <h3>photo preview</h3>
          <div className="grid grid-cols-4 gap-4 mb-8 mt-3">
            {Array.from({ length: option }).map((_, index) => {
              const photo = capturedPhotos[index];

              return (
                <div
                  key={index}
                  className="relative w-full aspect-3/2 border border-gray-300 bg-gray-100 flex items-center justify-center"
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
          <div className="px-2 flex justify-between items-center bg-amber-200 mt-3 mb-8 py-2 rounded-2xl">
            <button
              className="px-2 cursor-pointer hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 rounded-[10px] transition-all duration-100"
              onClick={() => setOption((prev) => prev - 1)}
              disabled={option === 4}
            >
              -
            </button>
            <p>{option}</p>
            <button
              className="px-2 cursor-pointer hover:bg-amber-400 disabled:cursor-not-allowed  disabled:bg-slate-300 disabled:text-slate-500 rounded-[10px] transition-all duration-100"
              onClick={() => setOption((prev) => prev + 1)}
              disabled={option === 8}
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
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
          <button
            className="w-full text-center bg-amber-300 py-2 rounded-2xl cursor-pointer hover:bg-amber-500 transition-all duration-200"
            onClick={() => setShowPrintPreview(true)}
          >
            Print your photos
          </button>
        </div>
      </div>

      {/* PRINT photos */}
      {showPrintPreview && (
        <div className="mt-6">
          <div
            id="collage-container"
            className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto"
          >
            {capturedPhotos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Captured ${i}`}
                className="w-full object-cover -scale-x-100"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded mx-auto cursor-pointer"
              onClick={handleDownloadCollage}
            >
              Download Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
