/**
 * AttendanceCamera Component
 * Captures face images for attendance verification
 * Uses MediaPipe Face Detection for validation
 */

import React, { useState, useRef, useEffect } from "react";
import { useUserProfile } from "../context/UserProfileContext";
import { Camera, AlertCircle, CheckCircle, Loader } from "lucide-react";
import {
  initializeFaceDetector,
  detectFaces,
  validateFaceDetection,
  drawDetections,
} from "../utils/loadFaceDetector";
import { uploadAttendancePhoto, submitAttendance } from "../services/attendanceService";

const AttendanceCamera = ({ onSuccess, onCancel }) => {
  const { userProfile } = useUserProfile();

  // Camera states
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Face detection states
  const [detectorReady, setDetectorReady] = useState(false);
  const [detectorError, setDetectorError] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);

  // Attendance submission states
  const [validationMessage, setValidationMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Captured image
  const [capturedImage, setCapturedImage] = useState(null);

  // Initialize face detector on component mount
  useEffect(() => {
    const initDetector = async () => {
      try {
        setDetectorError("");
        await initializeFaceDetector();
        setDetectorReady(true);
      } catch (error) {
        setDetectorError(error.message);
        console.error("Detector init error:", error);
      }
    };

    initDetector();

    // Cleanup: Stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  /**
   * Request camera access and start streaming
   */
  const startCamera = async () => {
    try {
      setCameraError("");
      setValidationError("");
      setValidationMessage("");

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Front camera
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // Set video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (error) {
      const message =
        error.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access."
          : error.name === "NotFoundError"
          ? "No camera device found."
          : `Camera error: ${error.message}`;

      setCameraError(message);
      console.error("Camera error:", error);
    }
  };

  /**
   * Stop camera stream
   */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  /**
   * Capture frame and detect faces
   */
  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current || !detectorReady) {
      setValidationError("Camera or detector not ready");
      return;
    }

    try {
      setIsDetecting(true);
      setValidationError("");
      setValidationMessage("");

      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      ctx.drawImage(video, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Run face detection
      const detectionResult = await detectFaces(imageData);

      // Validate detection
      const validation = validateFaceDetection(detectionResult);

      // Draw bounding boxes on canvas (for debugging)
      drawDetections(canvas, detectionResult);

      if (!validation.isValid) {
        setValidationError(validation.message);
        return;
      }

      setValidationMessage(validation.message);

      // Capture image data (successful detection)
      const imageBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });

      setCapturedImage({
        blob: imageBlob,
        canvas: canvas.toDataURL("image/jpeg", 0.9),
      });

      setValidationMessage("✅ Face validation successful! Ready to submit.");
    } catch (error) {
      setValidationError(`Detection failed: ${error.message}`);
      console.error("Detection error:", error);
    } finally {
      setIsDetecting(false);
    }
  };

  /**
   * Submit attendance with captured image
   */
  const submitAttendanceRecord = async () => {
    if (!capturedImage || !userProfile) {
      setValidationError("Image or user profile missing");
      return;
    }

    try {
      setIsSubmitting(true);
      setValidationError("");

      // 1. Upload photo to Supabase Storage
      const photoUrl = await uploadAttendancePhoto(
        userProfile.id,
        capturedImage.blob
      );

      // 2. Submit attendance record
      await submitAttendance({
        user_id: userProfile.id,
        photo_url: photoUrl,
      });

      setSubmitSuccess(true);
      setValidationMessage("✅ Attendance marked successfully!");

      // Call success callback
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      setValidationError(error.message || "Failed to submit attendance");
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset and close
   */
  const handleCancel = () => {
    stopCamera();
    setCapturedImage(null);
    setValidationMessage("");
    setValidationError("");
    if (onCancel) onCancel();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Camera className="w-6 h-6 text-blue-600" />
          Face Verification for Attendance
        </h2>
        <p className="text-gray-600 mt-2">
          We use face detection to verify your attendance. No face recognition or storage of
          facial features.
        </p>
      </div>

      {/* Error Messages */}
      {detectorError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Detector Error</p>
            <p className="text-sm text-red-700 mt-1">{detectorError}</p>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Camera Error</p>
            <p className="text-sm text-red-700 mt-1">{cameraError}</p>
          </div>
        </div>
      )}

      {validationError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">{validationError}</p>
        </div>
      )}

      {validationMessage && !validationError && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{validationMessage}</p>
        </div>
      )}

      {/* Camera Section */}
      <div className="mb-6">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            disabled={!detectorReady || isDetecting}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            {detectorReady ? "Start Camera" : "Loading Detector..."}
          </button>
        ) : (
          <>
            <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                className="w-full h-auto"
                playsInline
                muted
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={captureAndDetect}
                disabled={!cameraActive || isDetecting || capturedImage}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDetecting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Capture & Validate
                  </>
                )}
              </button>

              <button
                onClick={stopCamera}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Stop Camera
              </button>
            </div>
          </>
        )}
      </div>

      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Captured Image Preview */}
      {capturedImage && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Captured Image</h3>
          <img
            src={capturedImage.canvas}
            alt="Captured"
            className="w-full rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {capturedImage && !submitSuccess && (
          <>
            <button
              onClick={submitAttendanceRecord}
              disabled={isSubmitting || !capturedImage}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Mark Attendance
                </>
              )}
            </button>

            <button
              onClick={() => {
                setCapturedImage(null);
                setValidationMessage("");
              }}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Retake Photo
            </button>
          </>
        )}

        <button
          onClick={handleCancel}
          disabled={submitSuccess}
          className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
        >
          {submitSuccess ? "Closing..." : "Cancel"}
        </button>
      </div>

      {/* Success State */}
      {submitSuccess && (
        <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-xl font-bold text-green-900">Attendance Marked!</p>
          <p className="text-green-700 mt-2">Redirecting to dashboard...</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-semibold mb-2">📋 Privacy & Security</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Only face detection is performed (no face recognition)</li>
          <li>Your photo is uploaded to secure cloud storage</li>
          <li>Camera capture only (no gallery uploads)</li>
          <li>One attendance per day per employee</li>
        </ul>
      </div>
    </div>
  );
};

export default AttendanceCamera;
