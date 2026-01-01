# Smart Attendance System - Routing Architecture Guide

## Overview
This document explains the routing structure of the Smart Attendance System (HRMS) and how to add new pages.

## Current Route Map

```
/                              → Landing (Public)
/signup                        → Sign-in / Sign-up / Password Reset (Public)

/employee-dashboard            → Main Employee Dashboard (Protected)
  ├─ Sidebar Navigation to:
  ├─ /attendance-history       → Attendance History Table (Protected)
  ├─ /leave                    → Leave Management (Protected)
  ├─ /helpdesk                 → Support Tickets (Protected) [NEW]
  ├─ /profile                  → Profile Settings (Protected)
  ├─ /notification             → Notifications (Protected)
  └─ /calendar                 → Company Calendar (Protected)
```

## Key Files

### 1. **src/App.jsx** (Router Configuration)
- Defines all routes and their associated components
- Wraps protected routes with `<ProtectedRoute>` wrapper
- Uses React Router v6+ APIs

### 2. **src/context/UserProfileContext.jsx** (Authentication)
- Manages authentication state (`loading`, `userProfile`, `role`)
- Handles Supabase session initialization
- Provides fallback user data for users without profile records

### 3. **src/Dashboard/EmployeeDashboard.jsx** (Main Layout)
- Contains shared sidebar and header
- Uses `<Link>` components for navigation (NOT `navigate()` redirects)
- Sidebar links point to `/employee-dashboard`, `/attendance-history`, etc.

## How Navigation Works

### ✅ Correct Pattern (Used Here)
```jsx
// In Sidebar (EmployeeDashboard.jsx)
<Link to="/attendance-history" className="...">
  <span>Attendance History</span>
</Link>

// This allows browser back/forward buttons to work correctly
```

### ❌ Antipattern (Not Used)
```jsx
// Don't do this - breaks back button
const handleClick = () => navigate("/attendance-history");
<button onClick={handleClick}>...</button>
```

## Adding a New Page (Step-by-Step)

### Step 1: Create the Component
```jsx
// src/EmployeePages/MyNewPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const MyNewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button 
        onClick={() => navigate("/employee-dashboard")}
        className="flex items-center gap-2 text-indigo-600 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-bold">My New Page</h1>
      {/* Page content */}
    </div>
  );
};

export default MyNewPage;
```

### Step 2: Import in App.jsx
```jsx
import MyNewPage from "./EmployeePages/MyNewPage";
```

### Step 3: Add Route in App.jsx
```jsx
<Route
  path="my-new-page"
  element={
    <ProtectedRoute allowedRoles={['employee', 'admin']}>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

### Step 4: Add Sidebar Link (in EmployeeDashboard.jsx)
```jsx
<Link 
  to="/my-new-page" 
  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg..."
>
  <MyIcon className="w-5 h-5" />
  <span>My New Page</span>
</Link>
```

## Troubleshooting Navigation Issues

### Issue: "Loading..." Screen Hangs
**Solution:** Check `UserProfileContext.jsx` - the auth context must set `loading = false`
- See timeout safeguards added (5s timeout)
- Check console for warnings

### Issue: Back Button Doesn't Work
**Solution:** Ensure you're using `<Link>` in sidebar, NOT `navigate()` calls
- `<Link>` preserves browser history
- `navigate()` is for programmatic navigation after form submission

### Issue: Blank Page After Navigation
**Cause:** Missing `<ProtectedRoute>` wrapper or auth not initialized
**Fix:**
1. Verify route is wrapped with `<ProtectedRoute>`
2. Check DevTools Network tab for Supabase auth errors
3. Disable browser extensions interfering with page load

### Issue: Sidebar Reloads on Page Change
**Cause:** Component remounting due to missing layout structure
**Fix:** The sidebar should be OUTSIDE the `<Routes>` block:
```jsx
// ❌ Wrong - sidebar reloads
<Router>
  <Routes>
    <Route path="/page1" element={<Sidebar /><Page1 /></} />
  </Routes>
</Router>

// ✅ Correct - sidebar stays consistent
<Router>
  <Sidebar />  {/* Outside Routes */}
  <Routes>
    <Route path="/page1" element={<Page1 />} />
  </Routes>
</Router>
```

## Environment Variables
Required `.env` variables (in `frontend/.env`):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Testing Navigation
```bash
# Start dev server
npm run dev

# Test in browser:
1. Go to http://localhost:5173
2. Sign up / log in
3. Navigate using sidebar links
4. Click browser back button → should return to previous page
5. Refresh page → should stay on current page (not reset to dashboard)
6. Check console for auth logs (look for timeout warnings)
```

## Best Practices

✅ **DO:**
- Use `<Link to="...">` for navigation in UI
- Use `navigate()` only after form submissions
- Keep protected pages wrapped with `<ProtectedRoute>`
- Add a "Back" button on non-dashboard pages
- Test with browser back/forward buttons

❌ **DON'T:**
- Use `navigate()` for every button click
- Redirect in useEffect without proper dependencies
- Forget `allowedRoles` in protected routes
- Create circular navigation loops

## File Structure
```
src/
├── App.jsx                    ← Router config (MAIN)
├── Authentication/
│   └── Signup.jsx             ← Login/Signup form
├── Dashboard/
│   └── EmployeeDashboard.jsx  ← Main layout with sidebar
├── EmployeePages/
│   ├── AttendanceHistory.jsx
│   ├── EmployeeLeave.jsx
│   ├── ProfilePage.jsx
│   ├── Helpdesk.jsx           ← NEW
│   └── ...other pages
└── context/
    └── UserProfileContext.jsx ← Auth state
```

## Future Improvements
- [ ] Add role-based route access (admin-only pages)
- [ ] Add nested routes (e.g., `/attendance-history/:month`)
- [ ] Add 404 catch-all route
- [ ] Add loading boundaries at route level
- [ ] Add page transition animations
- [ ] Add breadcrumb navigation

---
**Last Updated:** 2026-01-01
**App Version:** 1.0.0 (Vite + React Router v6)
