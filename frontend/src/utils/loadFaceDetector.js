/**
 * MediaPipe Face Detector - Singleton Utility
 * Loads and manages the face detection model
 * Uses blaze_face_short_range model for real-time detection
 */

import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

let detector = null;
let isInitializing = false;

/**
 * Initialize the FaceDetector once and reuse it
 * @returns {Promise<FaceDetector>} The initialized detector instance
 */
export async function initializeFaceDetector() {
  // Return existing detector if already loaded
  if (detector) {
    return detector;
  }

  // Prevent multiple initialization attempts
  if (isInitializing) {
    // Wait for initialization to complete
    return new Promise((resolve) => {
      const checkDetector = setInterval(() => {
        if (detector) {
          clearInterval(checkDetector);
          resolve(detector);
        }
      }, 100);
    });
  }

  try {
    isInitializing = true;

    // Create the FilesetResolver with the wasm files
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Create the FaceDetector
    detector = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
      },
      runningMode: "IMAGE", // Required for still images from canvas
    });

    console.log("✅ Face Detector initialized successfully");
    return detector;
  } catch (error) {
    console.error("❌ Failed to initialize Face Detector:", error);
    throw new Error(`Face Detector initialization failed: ${error.message}`);
  } finally {
    isInitializing = false;
  }
}

/**
 * Get the already-initialized detector
 * @returns {FaceDetector|null} The detector instance or null if not initialized
 */
export function getFaceDetector() {
  return detector;
}

/**
 * Detect faces in an ImageData
 * @param {ImageData} imageData - The image data from canvas
 * @returns {Promise<Object>} Detection results with faces array
 */
export async function detectFaces(imageData) {
  try {
    if (!detector) {
      throw new Error("Face Detector not initialized. Call initializeFaceDetector first.");
    }

    // Run detection
    const detectionResult = detector.detect(imageData);

    return detectionResult;
  } catch (error) {
    console.error("❌ Face detection error:", error);
    throw new Error(`Face detection failed: ${error.message}`);
  }
}

/**
 * Validate face detection results
 * @param {Object} detectionResult - Result from detectFaces
 * @returns {Object} Validation result { isValid, message, faceCount, boundingBox }
 */
export function validateFaceDetection(detectionResult) {
  const faceCount = detectionResult.detections?.length || 0;
  const MIN_FACE_SIZE = 100; // Minimum width or height in pixels

  // No face detected
  if (faceCount === 0) {
    return {
      isValid: false,
      message: "❌ No face detected. Please face the camera.",
      faceCount: 0,
      boundingBox: null,
    };
  }

  // Multiple faces detected
  if (faceCount > 1) {
    return {
      isValid: false,
      message: `❌ Multiple faces detected (${faceCount}). Only one person is allowed.`,
      faceCount: faceCount,
      boundingBox: null,
    };
  }

  // Single face detected - validate size
  const detection = detectionResult.detections[0];
  const boundingBox = detection.boundingBox;

  if (!boundingBox) {
    return {
      isValid: false,
      message: "⚠️ Face detected but unable to determine size. Try again.",
      faceCount: 1,
      boundingBox: null,
    };
  }

  const { width, height } = boundingBox;

  // Face too small
  if (width < MIN_FACE_SIZE || height < MIN_FACE_SIZE) {
    return {
      isValid: false,
      message: `📏 Face too small. Move closer to the camera. (Size: ${Math.round(width)}x${Math.round(height)}px)`,
      faceCount: 1,
      boundingBox: boundingBox,
    };
  }

  // Face validation passed
  return {
    isValid: true,
    message: "✅ Face detected! Ready for attendance.",
    faceCount: 1,
    boundingBox: boundingBox,
    confidence: detection.categories?.[0]?.score || "N/A",
  };
}

/**
 * Draw detection results on canvas for debugging/visualization
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} detectionResult - Result from detectFaces
 */
export function drawDetections(canvas, detectionResult) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw detected faces
  const detections = detectionResult.detections || [];

  detections.forEach((detection, index) => {
    const boundingBox = detection.boundingBox;
    if (!boundingBox) return;

    const { originX, originY, width, height } = boundingBox;

    // Draw bounding box
    ctx.strokeStyle = index === 0 ? "#00FF00" : "#FF0000"; // Green for first face, red for others
    ctx.lineWidth = 3;
    ctx.strokeRect(originX, originY, width, height);

    // Draw label
    const label = `Face ${index + 1}`;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = "16px Arial";
    ctx.fillText(label, originX, originY - 5);

    // Draw confidence if available
    const confidence = detection.categories?.[0]?.score;
    if (confidence) {
      ctx.fillText(`Confidence: ${(confidence * 100).toFixed(1)}%`, originX, originY + height + 20);
    }
  });
}
