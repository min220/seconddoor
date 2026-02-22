import React, { useState } from "react";
import { Property } from "@entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Upload, FileText, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PropertyUpload({ brokerId, onPropertyAdded }) {
  const [activeMethod, setActiveMethod] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Manual form state
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
    minimum_income_multiplier: "3"
  });

  // CSV upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const propertyData = {
        ...formData,
        broker_id: brokerId,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        rent: parseFloat(formData.rent),
        security_deposit: formData.security_deposit ? parseFloat(formData.security_deposit) : null,
        minimum_income_multiplier: parseFloat(formData.minimum_income_multiplier),
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
        is_active: true
      };

      await Property.create(propertyData);
      
      setSuccess(true);
      setFormData({
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
        minimum_income_multiplier: "3"
      });
      
      setTimeout(() => setSuccess(false), 3000);
      onPropertyAdded();
    } catch (error) {
      setError("Error creating property. Please check all required fields.");
    }

    setIsSubmitting(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Upload file
      const { file_url } = await UploadFile({ file });
      setUploadProgress(50);

      // Extract data from CSV
      const result = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            properties: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  address: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  zip_code: { type: "string" },
                  bedrooms: { type: "number" },
                  bathrooms: { type: "number" },
                  square_feet: { type: "number" },
                  rent: { type: "number" },
                  security_deposit: { type: "number" },
                  description: { type: "string" },
                  available_date: { type: "string" }
                }
              }
            }
          }
        }
      });

      setUploadProgress(75);

      if (result.status === "success" && result.output.properties) {
        // Create properties in bulk
        const propertiesToCreate = result.output.properties.map(prop => ({
          ...prop,
          broker_id: brokerId,
          is_active: true,
          flexible_criteria: true // Default for bulk uploads
        }));

        await Property.bulkCreate(propertiesToCreate);
        setUploadProgress(100);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onPropertyAdded();
      } else {
        throw new Error("Could not extract property data from file");
      }
    } catch (error) {
      setError(`Error processing file: ${error.message}`);
    }

    setIsSubmitting(false);
    setUploadProgress(0);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant={activeMethod === "manual" ? "default" : "outline"}
              onClick={() => setActiveMethod("manual")}
              className="flex items-center gap-2 h-16"
            >
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Add Manually</div>
                <div className="text-xs opacity-70">Enter property details one by one</div>
              </div>
            </Button>
            
            <Button
              variant={activeMethod === "csv" ? "default" : "outline"}
              onClick={() => setActiveMethod("csv")}
              className="flex items-center gap-2 h-16"
            >
              <Upload className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Upload CSV</div>
                <div className="text-xs opacity-70">Bulk import from spreadsheet</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Property(ies) added successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Entry Form */}
      {activeMethod === "manual" && (
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rent">Monthly Rent *</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={formData.rent}
                    onChange={(e) => handleInputChange('rent', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => handleInputChange('zip_code', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={(e) => handleInputChange('square_feet', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="security_deposit">Security Deposit</Label>
                  <Input
                    id="security_deposit"
                    type="number"
                    min="0"
                    value={formData.security_deposit}
                    onChange={(e) => handleInputChange('security_deposit', e.target.value)}
                  />
                </div>
              </div>

              {/* Description and Amenities */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                  <Input
                    id="amenities"
                    placeholder="Pool, Parking, Laundry, Pet Friendly"
                    value={formData.amenities}
                    onChange={(e) => handleInputChange('amenities', e.target.value)}
                  />
                </div>
              </div>

              {/* Special Criteria */}
              <div className="space-y-4">
                <Label>Special Qualification Criteria</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accepts_evictions"
                      checked={formData.accepts_evictions}
                      onCheckedChange={(checked) => handleInputChange('accepts_evictions', checked)}
                    />
                    <Label htmlFor="accepts_evictions">Accepts Eviction History</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accepts_poor_credit"
                      checked={formData.accepts_poor_credit}
                      onCheckedChange={(checked) => handleInputChange('accepts_poor_credit', checked)}
                    />
                    <Label htmlFor="accepts_poor_credit">Accepts Poor Credit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accepts_criminal_background"
                      checked={formData.accepts_criminal_background}
                      onCheckedChange={(checked) => handleInputChange('accepts_criminal_background', checked)}
                    />
                    <Label htmlFor="accepts_criminal_background">Accepts Criminal Background</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flexible_criteria"
                      checked={formData.flexible_criteria}
                      onCheckedChange={(checked) => handleInputChange('flexible_criteria', checked)}
                    />
                    <Label htmlFor="flexible_criteria">Flexible Qualification Criteria</Label>
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="available_date">Available Date</Label>
                  <Input
                    id="available_date"
                    type="date"
                    value={formData.available_date}
                    onChange={(e) => handleInputChange('available_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum_income_multiplier">Income Requirement (x rent)</Label>
                  <Select
                    value={formData.minimum_income_multiplier}
                    onValueChange={(value) => handleInputChange('minimum_income_multiplier', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2x rent</SelectItem>
                      <SelectItem value="2.5">2.5x rent</SelectItem>
                      <SelectItem value="3">3x rent</SelectItem>
                      <SelectItem value="3.5">3.5x rent</SelectItem>
                      <SelectItem value="4">4x rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Adding Property..." : "Add Property"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* CSV Upload */}
      {activeMethod === "csv" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Upload Properties CSV
              </h3>
              <p className="text-slate-600 mb-4">
                Upload a CSV file with your property listings
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isSubmitting}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload">
                <Button asChild disabled={isSubmitting}>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Processing..." : "Choose File"}
                  </span>
                </Button>
              </label>
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                CSV should include columns: title, address, city, state, rent, bedrooms, bathrooms, description, etc.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}