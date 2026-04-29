"use client";

import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "fearful"
  | "disgusted"
  | "surprised"
  | "neutral"
  | null;

export function useEmotion(isEnabled: boolean, onError?: (err: string) => void) {
  const [dominantEmotion, setDominantEmotion] = useState<Emotion>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        if (isMounted) setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load face-api models", err);
        if (isMounted) {
          const msg = "Failed to load models";
          setError(msg);
          onError?.(msg);
        }
      }
    };

    if (isEnabled && !isModelLoaded && !error) {
      loadModels();
    }

    return () => {
      isMounted = false;
    };
  }, [isEnabled, isModelLoaded, error, onError]);

  useEffect(() => {
    if (!isEnabled || !isModelLoaded) return;

    let activeStream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Webcam requires HTTPS or localhost");
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        activeStream = mediaStream;
        setStream(mediaStream);

        if (!videoRef.current) {
          const video = document.createElement("video");
          video.style.display = "none";
          video.muted = true;
          video.playsInline = true;
          videoRef.current = video;
          document.body.appendChild(video);
        }

        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();

        intervalRef.current = window.setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            const detections = await faceapi
              .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            if (detections && detections.expressions) {
              const expressions = detections.expressions;
              const maxEmotion = Object.keys(expressions).reduce((a, b) =>
                expressions[a as keyof typeof expressions] >
                expressions[b as keyof typeof expressions]
                  ? a
                  : b,
              ) as Emotion;
              setDominantEmotion(maxEmotion);
            } else {
              setDominantEmotion(null);
            }
          }
        }, 2000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Webcam access denied";
        console.error("Error accessing webcam", err);
        setError(msg);
        onError?.(msg);
      }
    };

    startVideo();

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
      setDominantEmotion(null);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        if (videoRef.current.parentNode) {
          videoRef.current.parentNode.removeChild(videoRef.current);
        }
        videoRef.current = null;
      }
    };
  }, [isEnabled, isModelLoaded, onError]);

  return { dominantEmotion, error, stream };
}
