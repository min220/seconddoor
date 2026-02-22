import React, { useState } from "react";
import { Property } from "@/mock/base44";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, Home } from "lucide-react";

export default function LandlordFormPage() {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    rent: "",
    security_deposit: "",
    description: "",
    amenities: "",
    available_date: "",
    accepts_evictions: false,
    accepts_poor_credit: false,
    accepts_criminal_background: false,
    flexible_criteria: false,
    minimum_income_multiplier: "3",
    property_type: "apartment"
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
      const propertyData = {
        ...formData,
        broker_id: "landlord_submission", // Assign a default ID for admin review
        is_active: false, // Submitted properties are inactive until approved
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        rent: parseFloat(formData.rent),
        security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : null,
        minimum_income_multiplier: parseFloat(formData.minimum_income_multiplier),
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
      };

      await Property.create(propertyData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        title: "", address: "", city: "", state: "", zip_code: "",
        bedrooms: "", bathrooms: "", square_feet: "", rent: "", security_deposit: "",
        description: "", amenities: "", available_date: "",
        accepts_evictions: false, accepts_poor_credit: false, accepts_criminal_background: false, flexible_criteria: false,
        minimum_income_multiplier: "3", property_type: "apartment"
      });

    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit property. Please ensure all required fields are filled correctly.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">List Your Property</CardTitle>
          <CardDescription className="text-lg text-slate-600">
            Partner with us to find reliable tenants. Your listing will be reviewed before activation.
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
                Thank you! Your property has been submitted for review.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Info */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Property Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent *</Label>
                  <Input id="rent" type="number" value={formData.rent} onChange={(e) => handleInputChange('rent', e.target.value)} required />
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Address</h3>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input id="zip_code" value={formData.zip_code} onChange={(e) => handleInputChange('zip_code', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Property Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" type="number" min="0" value={formData.bedrooms} onChange={(e) => handleInputChange('bedrooms', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" type="number" min="0" step="0.5" value={formData.bathrooms} onChange={(e) => handleInputChange('bathrooms', e.target.value)} />
                 </div>
              </div>
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="square_feet">Square Feet</Label>
                    <Input id="square_feet" type="number" min="0" value={formData.square_feet} onChange={(e) => handleInputChange('square_feet', e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="security_deposit">Security Deposit</Label>
                    <Input id="security_deposit" type="number" min="0" value={formData.security_deposit} onChange={(e) => handleInputChange('security_deposit', e.target.value)} />
                 </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Description & Features</h3>
              <div className="space-y-2">
                <Label htmlFor="description">Property Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input id="amenities" placeholder="e.g., Pool, Parking, Laundry" value={formData.amenities} onChange={(e) => handleInputChange('amenities', e.target.value)} />
              </div>
               <div className="space-y-2">
                  <Label htmlFor="available_date">Available Date</Label>
                  <Input id="available_date" type="date" value={formData.available_date} onChange={(e) => handleInputChange('available_date', e.target.value)} />
                </div>
            </div>

            {/* Special Criteria */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">Tenant Qualifications</h3>
              <p className="text-sm text-slate-600">Check all that you are willing to consider for this property.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="accepts_evictions" checked={formData.accepts_evictions} onCheckedChange={(checked) => handleInputChange('accepts_evictions', checked)} />
                  <Label htmlFor="accepts_evictions">Accepts Eviction History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accepts_poor_credit" checked={formData.accepts_poor_credit} onCheckedChange={(checked) => handleInputChange('accepts_poor_credit', checked)} />
                  <Label htmlFor="accepts_poor_credit">Accepts Poor Credit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="accepts_criminal_background" checked={formData.accepts_criminal_background} onCheckedChange={(checked) => handleInputChange('accepts_criminal_background', checked)} />
                  <Label htmlFor="accepts_criminal_background">Accepts Criminal Background</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="flexible_criteria" checked={formData.flexible_criteria} onCheckedChange={(checked) => handleInputChange('flexible_criteria', checked)} />
                  <Label htmlFor="flexible_criteria">Other Flexible Criteria</Label>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}