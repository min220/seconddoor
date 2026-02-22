import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Check } from "lucide-react";

export default function PropertyFilters({ filters, onFiltersChange }) {
  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
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
            placeholder="City, State, or ZIP"
            value={filters.location || ""}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        {/* Rent Range */}
        <div className="space-y-4">
          <Label>Rent Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                placeholder="Min"
                type="number"
                value={filters.minRent || ""}
                onChange={(e) => updateFilter('minRent', e.target.value)}
              />
            </div>
            <div>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxRent || ""}
                onChange={(e) => updateFilter('maxRent', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <Label>Minimum Bedrooms</Label>
          <Select value={filters.bedrooms || ""} onValueChange={(value) => updateFilter('bedrooms', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Any</SelectItem>
              <SelectItem value="0">Studio</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Special Criteria */}
        <div className="space-y-4">
          <Label>Special Qualifications</Label>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                  filters.acceptsEvictions 
                    ? 'bg-green-50 border-green-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => updateFilter('acceptsEvictions', !filters.acceptsEvictions)}
              >
                {filters.acceptsEvictions && (
                  <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
                )}
              </div>
              <Label htmlFor="evictions" className="text-sm font-normal cursor-pointer">
                Accepts Eviction History
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <div 
                className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                  filters.acceptsPoorCredit 
                    ? 'bg-green-50 border-green-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => updateFilter('acceptsPoorCredit', !filters.acceptsPoorCredit)}
              >
                {filters.acceptsPoorCredit && (
                  <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
                )}
              </div>
              <Label htmlFor="poorCredit" className="text-sm font-normal cursor-pointer">
                Accepts Poor Credit
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <div 
                className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                  filters.acceptsCriminalBackground 
                    ? 'bg-green-50 border-green-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => updateFilter('acceptsCriminalBackground', !filters.acceptsCriminalBackground)}
              >
                {filters.acceptsCriminalBackground && (
                  <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
                )}
              </div>
              <Label htmlFor="criminalBackground" className="text-sm font-normal cursor-pointer">
                Accepts Criminal Background
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <div 
                className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer ${
                  filters.flexibleCriteria 
                    ? 'bg-green-50 border-green-500' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => updateFilter('flexibleCriteria', !filters.flexibleCriteria)}
              >
                {filters.flexibleCriteria && (
                  <Check className="w-3 h-3 text-green-600 font-bold stroke-[3]" />
                )}
              </div>
              <Label htmlFor="flexibleCriteria" className="text-sm font-normal cursor-pointer">
                Flexible Qualification Criteria
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}