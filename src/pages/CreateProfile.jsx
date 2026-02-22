import React, { useState } from "react";
import { ClientProfile, User } from "@/mock/base44";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, User as UserIcon } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function CreateProfilePage() {
  const [formData, setFormData] = useState({
    household_size: "",
    monthly_income: "",
    employment_type: "",
    has_eviction_history: false,
    eviction_details: "",
    credit_score_range: "",
    has_criminal_background: false,
    criminal_background_details: "",
    has_pets: false,
    pet_details: "",
    preferred_areas: "",
    max_rent: "",
    move_in_timeline: "",
    additional_notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current user
      const currentUser = await User.me();
      
      // Check if user already has a profile
      const existingProfiles = await ClientProfile.filter({ user_id: currentUser.id });
      
      if (existingProfiles.length > 0) {
        setError("You already have a profile. Please use the 'My Profile' page to update it.");
        setIsSubmitting(false);
        return;
      }

      const profileData = {
        user_id: currentUser.id,
        household_size: parseInt(formData.household_size),
        monthly_income: parseFloat(formData.monthly_income),
        employment_type: formData.employment_type,
        has_eviction_history: formData.has_eviction_history,
        eviction_details: formData.eviction_details,
        credit_score_range: formData.credit_score_range,
        has_criminal_background: formData.has_criminal_background,
        criminal_background_details: formData.criminal_background_details,
        has_pets: formData.has_pets,
        pet_details: formData.pet_details,
        preferred_areas: formData.preferred_areas ? formData.preferred_areas.split(',').map(a => a.trim()) : [],
        max_rent: parseFloat(formData.max_rent),
        move_in_timeline: formData.move_in_timeline,
        additional_notes: formData.additional_notes
      };

      await ClientProfile.create(profileData);
      setSuccess(true);

      // Redirect to profile page after a short delay
      setTimeout(() => {
        window.location.href = createPageUrl("Profile");
      }, 2000);

    } catch (err) {
      console.error("Profile creation error:", err);
      setError("Failed to create profile. Please ensure all required fields are filled correctly.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Create Your Housing Profile</CardTitle>
          <CardDescription className="text-lg text-slate-600">
            Help us match you with the right properties and brokers by sharing your housing needs and situation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Profile created successfully! Redirecting to your profile page...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="household_size">Household Size *</Label>
                  <Input 
                    id="household_size" 
                    type="number" 
                    min="1"
                    value={formData.household_size} 
                    onChange={(e) => handleInputChange('household_size', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Monthly Household Income *</Label>
                  <Input 
                    id="monthly_income" 
                    type="number" 
                    min="0"
                    value={formData.monthly_income} 
                    onChange={(e) => handleInputChange('monthly_income', e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Employment Type *</Label>
                <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
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
              </div>
            </div>

            {/* Housing Preferences */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Housing Preferences</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_rent">Maximum Monthly Rent *</Label>
                  <Input 
                    id="max_rent" 
                    type="number" 
                    min="0"
                    value={formData.max_rent} 
                    onChange={(e) => handleInputChange('max_rent', e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Move-in Timeline *</Label>
                  <Select value={formData.move_in_timeline} onValueChange={(value) => handleInputChange('move_in_timeline', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately</SelectItem>
                      <SelectItem value="1_month">Within 1 Month</SelectItem>
                      <SelectItem value="2_months">Within 2 Months</SelectItem>
                      <SelectItem value="3_months">Within 3 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferred_areas">Preferred Areas (comma-separated)</Label>
                <Input 
                  id="preferred_areas" 
                  placeholder="e.g., Downtown, Midtown, North Side"
                  value={formData.preferred_areas} 
                  onChange={(e) => handleInputChange('preferred_areas', e.target.value)} 
                />
              </div>
            </div>

            {/* Background Information */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Background Information</h3>
              <p className="text-sm text-slate-600 mb-4">
                This information helps us match you with properties and brokers who are understanding of your situation.
              </p>

              <div className="space-y-2">
                <Label>Credit Score Range</Label>
                <Select value={formData.credit_score_range} onValueChange={(value) => handleInputChange('credit_score_range', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credit range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent (750+)</SelectItem>
                    <SelectItem value="good">Good (700-749)</SelectItem>
                    <SelectItem value="fair">Fair (650-699)</SelectItem>
                    <SelectItem value="poor">Poor (Below 650)</SelectItem>
                    <SelectItem value="no_credit">No Credit History</SelectItem>
                    <SelectItem value="unknown">Don't Know</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="has_eviction_history" 
                    checked={formData.has_eviction_history} 
                    onCheckedChange={(checked) => handleInputChange('has_eviction_history', checked)} 
                  />
                  <Label htmlFor="has_eviction_history">I have eviction history</Label>
                </div>
                {formData.has_eviction_history && (
                  <Textarea
                    placeholder="Please provide details about your eviction history (optional)"
                    value={formData.eviction_details}
                    onChange={(e) => handleInputChange('eviction_details', e.target.value)}
                    rows={2}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="has_criminal_background" 
                    checked={formData.has_criminal_background} 
                    onCheckedChange={(checked) => handleInputChange('has_criminal_background', checked)} 
                  />
                  <Label htmlFor="has_criminal_background">I have a criminal background</Label>
                </div>
                {formData.has_criminal_background && (
                  <Textarea
                    placeholder="Please provide details about your criminal background (optional)"
                    value={formData.criminal_background_details}
                    onChange={(e) => handleInputChange('criminal_background_details', e.target.value)}
                    rows={2}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="has_pets" 
                    checked={formData.has_pets} 
                    onCheckedChange={(checked) => handleInputChange('has_pets', checked)} 
                  />
                  <Label htmlFor="has_pets">I have pets</Label>
                </div>
                {formData.has_pets && (
                  <Input
                    placeholder="Pet details (type, size, etc.)"
                    value={formData.pet_details}
                    onChange={(e) => handleInputChange('pet_details', e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="additional_notes">Additional Notes</Label>
                <Textarea
                  id="additional_notes"
                  placeholder="Any additional information you'd like to share that might help brokers understand your situation..."
                  value={formData.additional_notes}
                  onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}