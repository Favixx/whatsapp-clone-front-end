import { useStateProvider } from "@/context/StateContext";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import {
  FaTrash,
  FaPlay,
  FaStop,
  FaMicrophone,
  FaPauseCircle,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";
import axios from "axios";
import { reducerCases } from "@/context/constants";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  useEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(waveSurfer);
    waveSurfer.on("finish", () => setIsPlaying(false));

    return () => {
      waveSurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) handleStartRecording();
  }, [waveform]);

  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);
    setIsRecording(true);
    setRecordedAudio(null);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error ascending microphone", error);
      });
  };
  const handleStopRecording = () => {
    console.log("handleStopRecording called");
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      mediaRecorderRef.current.addEventListener("stop", () => {
        console.log("MediaRecorder stop event");
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
        if (recordedAudio) {
          recordedAudio.pause();
          recordedAudio.src = "";
        }
      });
    }
  };

  const handlePlayRecord = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };
  const handlePauseRecord = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();
      if (recordedAudio) {
        waveform.stop();
        recordedAudio.pause();
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handleSendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });

      if (response.status === 201) {
        setIsRecording(false);
        setRecordedAudio(null);
        setRenderedAudio(null);
        hide();

        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-lg text-white flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecord} />
                ) : (
                  <FaStop onClick={handlePauseRecord} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={() => handleStartRecording()}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={() => handleStopRecording()}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4"
          title="Send recording"
          onClick={handleSendRecording}
        />
      </div>
    </div>
  );
}

export default CaptureAudio;
