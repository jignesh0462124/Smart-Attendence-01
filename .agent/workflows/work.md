---
description: Project Work
---

# Smart Attendance – Workspace Rules

## Project Context
- Project: Smart-Attendance-01
- Application type: Employee Attendance System
- Frontend framework: React (Vite)
- Backend & Database: Supabase
- Authentication: Supabase Auth (email / password)
- Face detection engine: Google MediaPipe Face Detector (Web)
- Execution model: Fully client-side (no backend ML inference)

---

## Attendance Validation Policy (CRITICAL)
- Attendance MUST be marked only when **exactly ONE human face** is detected.
- Attendance MUST be rejected if:
  - Zero faces are detected
  - More than one face is detected
  - Face confidence score is below acceptable threshold
  - Face bounding box area is below minimum size (face too far or unclear)
- Face detection results MUST be validated before any attendance record is written.
- Attendance submission MUST be blocked at UI level on validation failure.
- Attendance logic MUST behave consistently for identical inputs.

---

## Time-Based Attendance Rules (STRICT)
- Each user may mark attendance **only once per calendar day**.
- Attendance consists of **two actions only**:
  - **Check-In**
  - **Check-Out**

### Check-In Rules
- Check-In is allowed **only once per day**.
- Check-In time window:
  - Starts at **09:30 AM**
- Any attempt to check in before 09:30 AM MUST be rejected.
- Multiple Check-In attempts on the same day MUST be blocked.

### Check-Out Rules
- Check-Out is allowed **only once per day**.
- Check-Out time window:
  - Starts at **05:00 PM**
- Any attempt to check out before 05:00 PM MUST be rejected.
- Check-Out MUST NOT be allowed unless Check-In was completed successfully.

### Daily Reset Rule
- Attendance state MUST reset automatically on **calendar day change**.
- A new day MUST allow:
  - One new Check-In
  - One new Check-Out
- Date comparison MUST be based on **local system date**.

---

## Monthly Attendance & Percentage Rules (CRITICAL)

### Monthly Attendance Scope
- Attendance MUST be calculated **month-wise**.
- Each new month MUST start with a **fresh attendance cycle**.
- Attendance data from previous months MUST NOT affect the current month’s calculation.

### Working Day Definition
- Only **working days** are counted toward attendance percentage.
- The following days MUST be **excluded automatically**:
  - **All Sundays**
  - **Declared holidays** (provided via static holiday list or configuration)
- Non-working days MUST NOT:
  - Require attendance
  - Reduce attendance percentage
  - Be counted in total working days

### Monthly Percentage Calculation
- Attendance percentage MUST be calculated as:


- Example:
  - Total working days in month: 22
  - Days attended: 22
  - Attendance percentage: **100%**

### Attendance Marking Rules for Percentage
- A day counts as **Present** only if:
  - Successful Check-In AND successful Check-Out are both completed
- Partial attendance MUST NOT count as Present.
- Sundays and holidays MUST be ignored entirely in calculations.

### Month Change Rule
- On **month change**:
  - Attendance counters MUST reset automatically
  - Percentage calculation MUST restart for the new month
- Month comparison MUST be based on **local calendar month and year**.

---

## Camera & Input Restrictions
- Image source MUST be a **live webcam stream only**.
- File upload, gallery selection, drag-drop, or external images are STRICTLY forbidden.
- Camera frames MUST be captured using HTML `<video>` and `<canvas>` APIs.
- Face detection MUST operate only on real-time captured frames.

---

## Face Detection Implementation Rules
- MediaPipe FaceDetector MUST be initialized once and reused.
- Detector configuration:
  - Model: `blaze_face_short_range`
  - runningMode: `IMAGE`
- Face detection MUST run entirely in the browser.
- No face data may be transmitted outside the client.

---

## Data Handling & Privacy Rules
- Do NOT store raw face images.
- Do NOT store face embeddings or biometric vectors.
- Attendance records may contain ONLY:
  - User identifier
  - Attendance type (check-in / check-out)
  - Attendance status (success / rejected)
  - Timestamp
  - Non-biometric validation result flags
- No biometric or visual data may be persisted.

---

## Coding Standards
- Use functional components and React Hooks ONLY.
- Separate responsibilities clearly:
  - `hooks/` → camera, detection, validation, time rules, monthly calculations
  - `services/` → Supabase interaction only
- Avoid large, tightly coupled components.
- Prefer clarity and maintainability over premature optimization.
- All asynchronous operations MUST include proper error handling.

---

## Performance & UX Guidelines
- Face detection MUST not block the UI unnecessarily.
- Clear and human-readable error messages MUST be shown for:
  - Invalid check-in time
  - Invalid check-out time
  - Duplicate attendance attempts
  - Face validation failures
- Loading indicators MUST be shown during:
  - Camera initialization
  - Face detection processing
- The user MUST clearly understand:
  - Daily attendance status
  - Monthly attendance percentage

---

## Agent Behavior Constraints
- Do NOT introduce admin-specific concepts, logic, or permissions.
- Do NOT suggest backend face recognition or biometric processing.
- Do NOT suggest cloud-based vision APIs.
- Do NOT suggest storing or processing biometric data.
- Stay strictly within the defined employee-side project architecture.

---

