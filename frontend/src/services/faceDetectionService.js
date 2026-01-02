import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision";

let faceDetector = null;

/**
 * Initialize the Face Detector
 */
export const initializeFaceDetector = async () => {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        faceDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
                delegate: "GPU"
            },
            runningMode: "VIDEO"
        });

        console.log("✅ Face Detector Initialized");
        return true;
    } catch (error) {
        console.error("❌ Error initializing Face Detector:", error);
        return false;
    }
};

/**
 * Detect faces in a video frame
 * @param {HTMLVideoElement} videoElement 
 * @returns {Object} { numberOfFaces, detections }
 */
export const detectFaces = (videoElement) => {
    if (!faceDetector) {
        console.warn("Face Detector not initialized yet.");
        return { numberOfFaces: 0, detections: [] };
    }

    if (!videoElement || videoElement.readyState !== 4) {
        return { numberOfFaces: 0, detections: [] };
    }

    const detections = faceDetector.detectForVideo(videoElement, performance.now()).detections;

    return {
        numberOfFaces: detections.length,
        detections: detections
    };
};
