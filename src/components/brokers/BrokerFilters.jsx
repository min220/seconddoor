import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Check } from "lucide-react";

const SPECIALIZATIONS = [
  { value: "evictions", label: "Eviction History" },
  { value: "poor_credit", label: "Poor Credit" },
  { value: "criminal_background", label: "Criminal Background" },
  { value: "bankruptcy", label: "Bankruptcy" },
  { value: "no_credit", label: "No Credit" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "section_8", label: "Section 8" },
  { value: "first_time_renters", label: "First-Time Renters" }
];

export default function BrokerFilters({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSpecialization = (spec) => {
    const current = filters.specializations || [];
    const updated = current.includes(spec)
      ? current.filter(s => s !== spec)
      : [...current, spec];
    updateFilter('specializations', updated);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City or State"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Minimum Rating */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <Select value={filters.minRating} onValueChange={(value) => updateFilter('minRating', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Any rating</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="4.0">4.0+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
              <SelectItem value="3.0">3.0+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified Only */}
        <div className="flex items-center space-x-3">
          <div 
            className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
              filters.isVerified 
                ? 'bg-green-50 border-green-500' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => updateFilter('isVerified', !filters.isVerified)}
          >
            {filters.isVerified && (
              <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
            )}
          </div>
          <Label htmlFor="verified" className="text-sm cursor-pointer">
            Verified brokers only
          </Label>
        </div>

        {/* Specializations */}
        <div className="space-y-4">
          <Label>Specializations</Label>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {SPECIALIZATIONS.map((spec) => (
              <div key={spec.value} className="flex items-center space-x-3">
                <div 
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                    filters.specializations?.includes(spec.value) 
                      ? 'bg-green-50 border-green-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => toggleSpecialization(spec.value)}
                >
                  {filters.specializations?.includes(spec.value) && (
                    <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
                  )}
                </div>
                <Label htmlFor={spec.value} className="text-sm cursor-pointer">
                  {spec.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}