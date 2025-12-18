import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, FileText, FolderOpen, HelpCircle, LogOut, Bell, User, Settings, MapPin, Briefcase, Mail, Phone, Camera } from 'lucide-react';
import { useUserProfile } from '../Authentication/useUserProfile';
import { supabase } from '../../supabase/supabase';

const ProfilePage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { profile, loadingProfile, setProfile, refreshProfile } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: ''
  });

  useEffect(() => {
    if (profile.name) {
      const nameParts = profile.name.split(' ');
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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
      const { data, error: uploadError } = await supabase.storage
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

      // 3. Update public.users table (Matches your schema: user_id, profile_image)
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image: publicUrl })
        .eq('user_id', profile.user_id);

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
      .from('users')
      .update({
        full_name: fullName,
        phone_number: formData.phone,
        address: formData.address
      })
      .eq('user_id', profile.user_id);

    if (error) {
      setMessage({ type: 'error', text: 'Update failed: ' + error.message });
    } else {
      setMessage({ type: 'success', text: 'Profile updated!' });
      refreshProfile();
    }
    setIsSaving(false);
  };

  if (loadingProfile) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar UI preserved */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-white" /></div>
            <div><h1 className="text-lg font-bold text-gray-900">HRMS</h1><p className="text-xs text-gray-500">Control</p></div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
          <div className="space-y-1">
            <Link to="/employee-dashboard" className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <TrendingUp className="w-5 h-5" /><span>Dashboard</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
               {profile.profile_image ? <img src={profile.profile_image} className="w-full h-full object-cover" /> : profile.initials}
            </div>
            <div className="flex-1"><p className="text-sm font-semibold text-gray-900 truncate w-32">{profile.name}</p></div>
          </div>
          <button onClick={handleSignOut} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-full"><LogOut className="w-4 h-4" /><span>Sign Out</span></button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-900">My Account</h2></div>
        </header>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {message.text && <div className={`mb-6 p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>}

            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                  <img
                    src={profile.profile_image || `https://ui-Profileimages.com/api/?name=${profile.name}&size=96&background=4F46E5&color=fff`}
                    alt="Profile"
                    className="w-24 h-24 object-cover"
                  />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">{profile.name}</h3>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1"><Briefcase className="w-4 h-4" /><span>ID: {profile.employee_id}</span></div>
                  <div className="flex items-center space-x-1"><MapPin className="w-4 h-4" /><span>{profile.address || 'No address set'}</span></div>
                </div>
              </div>
            </div>

            {/* Tabs & Form preserved exactly as original UI */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button onClick={() => setActiveTab('personal')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Personal Info</button>
                <button onClick={() => setActiveTab('security')} className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Account Security</button>
              </div>
            </div>

            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-400 text-sm cursor-not-allowed" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none text-sm" /></div>
                <div className="flex justify-end pt-4"><button onClick={handleSaveChanges} disabled={isSaving} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm disabled:opacity-50">{isSaving ? 'Updating...' : 'Save Changes'}</button></div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;