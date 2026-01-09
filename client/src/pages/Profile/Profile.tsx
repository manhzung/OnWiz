/**
 * Profile page - User profile management
 */

import { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { showToast } from '../../utils';

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'Passionate about learning and sharing knowledge',
    phone: '0123 456 789'
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to update profile
      console.log('Saving profile:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      showToast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showToast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="w-full bg-white min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {formData.name.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{formData.name}</h2>
                  <p className="text-gray-600">{formData.email}</p>
                </div>
                <Button
                  variant={isEditing ? "primary" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Save Changes' : 'Edit'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Yourself
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <span className="text-gray-900 ml-2">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">About:</span>
                    <p className="text-gray-900 mt-1">{formData.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">B</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">12</h3>
            <p className="text-sm text-gray-600">Courses Enrolled</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">8</h3>
            <p className="text-sm text-gray-600">Courses Completed</p>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">5</h3>
            <p className="text-sm text-gray-600">Certificates Earned</p>
          </Card>
        </div>

        {/* Account Settings */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>

          <div className="space-y-6">
            {/* Password */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your login password</p>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div>
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-600">Manage notification settings</p>
              </div>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-medium text-gray-900">Privacy</h3>
                <p className="text-sm text-gray-600">Control your public information</p>
              </div>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
