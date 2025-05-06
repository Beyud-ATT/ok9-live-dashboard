import { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
  FaRegEye,
} from "react-icons/fa";
import flvjs from "flv.js";
import Hls from "hls.js";
import { Flex, Spin } from "antd";
import { useNavigate } from "react-router";
import { useSignalR } from "../contexts/SIgnalRContext";
import useLiveDetail from "../hooks/useLiveDetail";

// export const heightSetting = `xl:h-[560px] md:h-[450px] h-[300px]`;
export const heightSetting = `h-full`;

const ViewerCount = ({ isStreaming, liveDetailData }) => {
  const { viewer } = useSignalR();

  return (
    <div className="flex items-center justify-center space-x-1 md:text-base text-[.6rem]">
      <FaRegEye />
      <span>{isStreaming ? viewer || liveDetailData?.viewer : 0}</span>
    </div>
  );
};

const LivestreamPlayer = () => {
  const navigate = useNavigate();

  const liveId = localStorage.getItem("userCode");
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const volumeControlRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoLiveHeightSetting = `${isFullscreen ? "!h-full" : heightSetting}`;
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: liveData, isLoading: isLiveDetailLoading } =
    useLiveDetail(liveId);
  const liveDetailData = liveData?.data?.data;
  const flvUrl = liveDetailData?.flvLink;
  const hlsUrl = liveDetailData?.hlsLink;

  const getVolumePercentageStyle = () => {
    return {
      background: `linear-gradient(to right, white ${volume}%, rgba(255, 255, 255, 0.3) ${volume}%)`,
    };
  };

  useEffect(() => {
    if (isLiveDetailLoading) return;

    if (flvUrl || hlsUrl) {
      initializePlayer();
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      destroyPlayer();
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, [flvUrl, hlsUrl]);

  const initializePlayer = () => {
    setError(null);
    setIsLoading(true);

    // Check if FLV is available and preferred
    if (flvUrl) {
      // console.log("Attempting to play FLV:", flvUrl);
      // console.log("FLV.js Support:", flvjs.isSupported());
      // console.log("Video element ready:", videoRef.current);
      if (flvjs.isSupported()) {
        initializeFLVPlayer();
        setIsLoading(false);
        return; // Exit after initializing FLV
      } else {
        console.warn("FLV not supported, falling back to HLS");
        setIsLoading(false);
      }
    }

    // Fallback to HLS
    if (hlsUrl) {
      // console.log("Attempting to play HLS:", hlsUrl);
      initializeHLSPlayer();
      setIsLoading(false);
    } else {
      setError("No streaming URL available");
      setIsLoading(false);
    }
  };

  const initializeHLSPlayer = () => {
    try {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = hlsUrl;
        startPlayback();
      } else if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", event, data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError("Network error occurred. Retrying...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError("Media error occurred. Recovering...");
                hls.recoverMediaError();
                break;
              default:
                setError("Fatal streaming error occurred");
                destroyPlayer();
                setTimeout(initializePlayer, 5000);
                break;
            }
          }
        });

        hls.loadSource(hlsUrl);
        hls.attachMedia(videoRef.current);
        playerRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          startPlayback();
        });
      } else {
        setError("HLS playback is not supported in this browser");
      }
    } catch (error) {
      console.error("HLS initialization error:", error);
      setError("Failed to initialize HLS player");
    }
  };

  const initializeFLVPlayer = () => {
    try {
      if (flvjs.isSupported()) {
        const flvPlayer = flvjs.createPlayer({
          type: "flv",
          url: flvUrl,
          isLive: true,
        });

        flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail) => {
          console.error("FLV Error Type:", errorType);
          console.error("Error Details:", errorDetail);
          console.error("Player Info:", flvPlayer.getStatisticsInfo());
          setError("Stream error occurred. Retrying...");
          destroyPlayer();
          setTimeout(initializePlayer, 5000);
        });

        // flvPlayer.on(flvjs.Events.STATISTICS_INFO, (stats) => {
        //   console.log("Player Statistics:", stats);
        // });

        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        playerRef.current = flvPlayer;

        startPlayback();
      } else {
        setError("FLV playback is not supported in this browser");
      }
    } catch (error) {
      console.error("FLV initialization error:", error);
      setError("Failed to initialize FLV player");
    }
  };

  const startPlayback = () => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Playback failed:", error);
          if (error.name === "NotAllowedError") {
            setError("NotAllowedError");
          } else {
            setError("Failed to start playback. Please try again.");
          }
          setIsPlaying(false);
          setIsLoading(false);
        });
    }
  };

  const handleInitialPlay = () => {
    navigate(`/live/${liveId}`);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);

      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(50);
      }
    }
  };

  const destroyPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.src = "";
      videoRef.current.load();
    }
  };

  const handleReplay = () => {
    destroyPlayer();
    initializePlayer();
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(
      !!(document.fullscreenElement || document.webkitFullscreenElement)
    );
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            setError("Failed to start playback. Please try again.");
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      if (newVolume === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  return (
    <div ref={containerRef} className={`w-full ${heightSetting} relative`}>
      {(isLiveDetailLoading || isLoading) && (
        <div className={`relative ${heightSetting}`}>
          <Spin
            size="large"
            className="absolute top-1/2 left-1/2 -translate-x-[90%] -translate-y-2/3 live-detail-spinning"
          />
        </div>
      )}
      <video
        ref={videoRef}
        className={`object-contain bg-black w-full ${videoLiveHeightSetting}`}
        playsInline
        muted={isMuted}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex justify-between items-center gap-4">
          <Flex gap={16}>
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-200"
            >
              {isPlaying ? (
                <FaPause className="md:text-xl text-lg" />
              ) : (
                <FaPlay className="md:text-xl text-lg" />
              )}
            </button>
            <button
              onClick={handleReplay}
              className="text-white hover:text-gray-200"
            >
              <FaRedo className="md:text-xl text-lg" />
            </button>
          </Flex>

          <Flex gap={16}>
            <div ref={volumeControlRef} className="flex items-center">
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-200"
              >
                {isMuted ? (
                  <FaVolumeMute className="md:text-xl text-lg" />
                ) : (
                  <FaVolumeUp className="md:text-xl text-lg" />
                )}
              </button>

              <div className="w-24 h-8 rounded-lg items-center px-3 transform md:flex hidden">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={getVolumePercentageStyle()}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer 
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-3 
                        [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:hover:w-4
                        [&::-webkit-slider-thumb]:hover:h-4
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-runnable-track]:rounded-lg
                        [&::-webkit-slider-runnable-track]:bg-transparent
                        [&::-moz-range-thumb]:w-3
                        [&::-moz-range-thumb]:h-3
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-0
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-track]:rounded-lg
                        [&::-moz-range-track]:bg-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleFullscreen}
              className="text-white hover:text-gray-200"
            >
              {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
            </button>
          </Flex>
        </div>
      </div>
    </div>
  );
};

export default LivestreamPlayer;
