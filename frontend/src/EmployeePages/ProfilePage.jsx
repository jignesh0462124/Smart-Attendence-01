// src/EmployeePages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Camera
} from 'lucide-react';
import { useUserProfile } from '../context/UserProfileContext';
import { supabase } from '../../supabase/supabase';

const ProfilePage = () => {
  const fileInputRef = useRef(null);
  const { userProfile, loading, refreshProfile } = useUserProfile();
  const { darkMode } = useOutletContext();
  const profile = userProfile || {};
  const loadingProfile = loading;

  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    if (profile.full_name) {
      const nameParts = profile.full_name.split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || '',
        phone: profile.phone_number || '',
        address: profile.address || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsSaving(true);
    setMessage({ type: '', text: 'Uploading image...' });

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.user_id}/${Math.random()}.${fileExt}`;

      // 1. Upload to 'Profileimages' bucket
      const { error: uploadError } = await supabase.storage
        .from('Profileimages')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error("Storage Error: The 'Profileimages' bucket does not exist. Please create it in your Supabase Dashboard.");
        }
        throw uploadError;
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('Profileimages')
        .getPublicUrl(filePath);

      // 3. Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setMessage({ type: 'success', text: 'Profile picture updated!' });
      refreshProfile();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone_number: formData.phone,
        address: formData.address
      })
      .eq('id', profile.id);

    if (error) {
      setMessage({ type: 'error', text: 'Update failed: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated!' });
      refreshProfile();
    }
    setIsSaving(false);
  };

  if (loadingProfile) return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          My Account
        </h2>
      </div>

      <div className={`rounded-xl shadow-sm border p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success'
            ? (darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700')
            : (darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700')
            }`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt="Profile" className="w-24 h-24 object-cover" />
              ) : (
                <span className="text-white text-3xl font-bold">{profile.initials}</span>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center md:text-left">
            <h3 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {profile.full_name}
            </h3>
            <div className={`flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span>ID: {profile.id}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profile.address || 'No address set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`border-b mb-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal'
                ? 'border-indigo-600 text-indigo-600'
                : `border-transparent ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`
                }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : `border-transparent ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`
                }`}
            >
              Account Security
            </button>
          </div>
        </div>

        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm cursor-not-allowed ${darkMode ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-50 border-gray-200 text-gray-400"}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300 text-gray-900"}`}
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
