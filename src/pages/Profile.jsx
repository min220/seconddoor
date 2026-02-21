import React, { useState, useEffect } from "react";
import { ClientProfile, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User as UserIcon, 
  Edit, 
  Save, 
  X, 
  Home, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const profiles = await ClientProfile.filter({ user_id: currentUser.id });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setEditData(profiles[0]);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
    setIsLoading(false);
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      const updateData = {
        ...editData,
        preferred_areas: typeof editData.preferred_areas === 'string' 
          ? editData.preferred_areas.split(',').map(a => a.trim()) 
          : editData.preferred_areas
      };

      await ClientProfile.update(profile.id, updateData);
      setProfile(updateData);
      setIsEditing(false);
      setSaveMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage("Error saving profile. Please try again.");
    }
    
    setIsSaving(false);
  };

  const getEmploymentTypeLabel = (type) => {
    const labels = {
      full_time: "Full-Time",
      part_time: "Part-Time", 
      self_employed: "Self-Employed",
      unemployed: "Unemployed",
      disability: "Disability Benefits",
      retirement: "Retirement",
      other: "Other"
    };
    return labels[type] || type;
  };

  const getCreditScoreLabel = (range) => {
    const labels = {
      excellent: "Excellent (750+)",
      good: "Good (700-749)",
      fair: "Fair (650-699)",
      poor: "Poor (Below 650)",
      no_credit: "No Credit History",
      unknown: "Unknown"
    };
    return labels[range] || range;
  };

  const getTimelineLabel = (timeline) => {
    const labels = {
      immediate: "Immediately",
      "1_month": "Within 1 Month",
      "2_months": "Within 2 Months", 
      "3_months": "Within 3 Months",
      flexible: "Flexible"
    };
    return labels[timeline] || timeline;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64 mx-auto" />
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            No Profile Found
          </h2>
          <p className="text-slate-600 mb-6">
            You haven't created a housing profile yet. Create one to get matched with suitable properties and brokers.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link to={createPageUrl("CreateProfile")}>
              Create Your Profile
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Housing Profile</h1>
        <p className="text-slate-600">
          Welcome back, {user?.full_name || user?.email}
        </p>
      </div>

      {saveMessage && (
        <Alert className={`mb-6 ${saveMessage.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
          {saveMessage.includes('Error') ? 
            <AlertCircle className="h-4 w-4 text-red-600" /> : 
            <CheckCircle className="h-4 w-4 text-green-600" />
          }
          <AlertDescription className={saveMessage.includes('Error') ? 'text-red-800' : 'text-green-800'}>
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-6 h-6" />
            Housing Profile
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-600">Household Size</Label>
                {isEditing ? (
                  <Input 
                    type="number" 
                    value={editData.household_size || ''} 
                    onChange={(e) => handleEditChange('household_size', parseInt(e.target.value))}
                  />
                ) : (
                  <p className="text-lg">{profile.household_size} people</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Monthly Income</Label>
                {isEditing ? (
                  <Input 
                    type="number" 
                    value={editData.monthly_income || ''} 
                    onChange={(e) => handleEditChange('monthly_income', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-lg">${profile.monthly_income?.toLocaleString()}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Employment Type</Label>
                {isEditing ? (
                  <Select 
                    value={editData.employment_type} 
                    onValueChange={(value) => handleEditChange('employment_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Full-Time</SelectItem>
                      <SelectItem value="part_time">Part-Time</SelectItem>
                      <SelectItem value="self_employed">Self-Employed</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="disability">Disability Benefits</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{getEmploymentTypeLabel(profile.employment_type)}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Credit Score Range</Label>
                {isEditing ? (
                  <Select 
                    value={editData.credit_score_range} 
                    onValueChange={(value) => handleEditChange('credit_score_range', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (750+)</SelectItem>
                      <SelectItem value="good">Good (700-749)</SelectItem>
                      <SelectItem value="fair">Fair (650-699)</SelectItem>
                      <SelectItem value="poor">Poor (Below 650)</SelectItem>
                      <SelectItem value="no_credit">No Credit History</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg">{getCreditScoreLabel(profile.credit_score_range)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Housing Preferences */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Home className="w-5 h-5" />
              Housing Preferences
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-600">Maximum Rent</Label>
                {isEditing ? (
                  <Input 
                    type="number" 
                    value={editData.max_rent || ''} 
                    onChange={(e) => handleEditChange('max_rent', parseFloat(e.target.value))}
                  />
                ) : (
                  <p className="text-lg flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ${profile.max_rent?.toLocaleString()}/month
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Move-in Timeline</Label>
                {isEditing ? (
                  <Select 
                    value={editData.move_in_timeline} 
                    onValueChange={(value) => handleEditChange('move_in_timeline', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately</SelectItem>
                      <SelectItem value="1_month">Within 1 Month</SelectItem>
                      <SelectItem value="2_months">Within 2 Months</SelectItem>
                      <SelectItem value="3_months">Within 3 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {getTimelineLabel(profile.move_in_timeline)}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-slate-600">Preferred Areas</Label>
              {isEditing ? (
                <Input 
                  placeholder="Comma-separated areas" 
                  value={Array.isArray(editData.preferred_areas) ? editData.preferred_areas.join(', ') : editData.preferred_areas || ''} 
                  onChange={(e) => handleEditChange('preferred_areas', e.target.value)}
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.preferred_areas?.map((area, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {area}
                    </Badge>
                  )) || <p className="text-slate-500">No preferred areas specified</p>}
                </div>
              )}
            </div>
          </div>

          {/* Background Information */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="font-semibold text-lg">Background Information</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Eviction History</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={editData.has_eviction_history} 
                          onCheckedChange={(checked) => handleEditChange('has_eviction_history', checked)}
                        />
                        <Label className="text-sm">I have eviction history</Label>
                      </div>
                      {editData.has_eviction_history && (
                        <Textarea 
                          placeholder="Eviction details" 
                          value={editData.eviction_details || ''} 
                          onChange={(e) => handleEditChange('eviction_details', e.target.value)}
                          rows={2}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <Badge variant={profile.has_eviction_history ? "destructive" : "default"}>
                        {profile.has_eviction_history ? "Yes" : "No"}
                      </Badge>
                      {profile.has_eviction_history && profile.eviction_details && (
                        <p className="text-sm text-slate-600 mt-1">{profile.eviction_details}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Criminal Background</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={editData.has_criminal_background} 
                          onCheckedChange={(checked) => handleEditChange('has_criminal_background', checked)}
                        />
                        <Label className="text-sm">I have criminal background</Label>
                      </div>
                      {editData.has_criminal_background && (
                        <Textarea 
                          placeholder="Criminal background details" 
                          value={editData.criminal_background_details || ''} 
                          onChange={(e) => handleEditChange('criminal_background_details', e.target.value)}
                          rows={2}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <Badge variant={profile.has_criminal_background ? "destructive" : "default"}>
                        {profile.has_criminal_background ? "Yes" : "No"}
                      </Badge>
                      {profile.has_criminal_background && profile.criminal_background_details && (
                        <p className="text-sm text-slate-600 mt-1">{profile.criminal_background_details}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">Pets</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={editData.has_pets} 
                          onCheckedChange={(checked) => handleEditChange('has_pets', checked)}
                        />
                        <Label className="text-sm">I have pets</Label>
                      </div>
                      {editData.has_pets && (
                        <Input 
                          placeholder="Pet details" 
                          value={editData.pet_details || ''} 
                          onChange={(e) => handleEditChange('pet_details', e.target.value)}
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <Badge variant={profile.has_pets ? "default" : "outline"}>
                        {profile.has_pets ? "Yes" : "No"}
                      </Badge>
                      {profile.has_pets && profile.pet_details && (
                        <p className="text-sm text-slate-600 mt-1">{profile.pet_details}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label className="text-sm font-medium text-slate-600">Additional Notes</Label>
                {isEditing ? (
                  <Textarea 
                    placeholder="Additional information..." 
                    value={editData.additional_notes || ''} 
                    onChange={(e) => handleEditChange('additional_notes', e.target.value)}
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-700 mt-1">
                    {profile.additional_notes || "No additional notes"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}