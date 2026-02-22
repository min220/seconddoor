
import React, { useState, useEffect, useCallback } from "react";
import { Property, Broker } from "@/mock/base44";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Filter,
  ArrowRight,
  Shield,
  DollarSign
} from "lucide-react";

import PropertyFilters from "../components/properties/PropertyFilters";
import PropertyCard from "../components/properties/PropertyCard";
import PropertyDetails from "../components/properties/PropertyDetails";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    acceptsEvictions: false,
    acceptsPoorCredit: false,
    acceptsCriminalBackground: false,
    flexibleCriteria: false
  });

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      // Only load active properties for public viewing
      const data = await Property.filter({ is_active: true }, '-created_date', 50);
      setProperties(data);
    } catch (error) {
      console.error("Error loading properties:", error);
    }
    setIsLoading(false);
  };

  const loadPropertyDetails = async (propertyId) => {
    try {
      const properties = await Property.filter({ id: propertyId });
      if (properties.length > 0) {
        setSelectedProperty(properties[0]);
      }
    } catch (error) {
      console.error("Error loading property details:", error);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = properties;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.state?.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.zip_code?.includes(filters.location)
      );
    }

    // Rent range
    if (filters.minRent) {
      filtered = filtered.filter(property => property.rent >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(property => property.rent <= parseInt(filters.maxRent));
    }

    // Bedrooms
    if (filters.bedrooms) {
      const bedroomFilter = parseInt(filters.bedrooms);
      if (bedroomFilter === 0) {
        // Studio apartments
        filtered = filtered.filter(property => property.bedrooms === 0 || property.property_type === "studio");
      } else {
        filtered = filtered.filter(property => property.bedrooms >= bedroomFilter);
      }
    }

    // Special criteria filters
    if (filters.acceptsEvictions) {
      filtered = filtered.filter(property => property.accepts_evictions);
    }
    if (filters.acceptsPoorCredit) {
      filtered = filtered.filter(property => property.accepts_poor_credit);
    }
    if (filters.acceptsCriminalBackground) {
      filtered = filtered.filter(property => property.accepts_criminal_background);
    }
    if (filters.flexibleCriteria) {
      filtered = filtered.filter(property => property.flexible_criteria);
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]); // Dependencies for useCallback

  useEffect(() => {
    loadProperties();
    
    // Check if there's a specific property ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    if (propertyId) {
      loadPropertyDetails(propertyId);
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Now depends on the memoized applyFilters

  if (selectedProperty) {
    return (
      <PropertyDetails 
        property={selectedProperty} 
        onBack={() => setSelectedProperty(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Available Properties
        </h1>
        <p className="text-slate-600">
          Find apartments that welcome your application regardless of your background
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by property name, address, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading ? "Loading..." : `${filteredProperties.length} properties found`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadProperties}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Refresh Listings
            </Button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No properties found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search criteria or filters, or check back later for new listings.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      location: "",
                      minRent: "",
                      maxRent: "",
                      bedrooms: "",
                      acceptsEvictions: false,
                      acceptsPoorCredit: false,
                      acceptsCriminalBackground: false,
                      flexibleCriteria: false
                    });
                  }}
                >
                  Clear all filters
                </Button>
                <Button asChild>
                  <Link to={createPageUrl("LandlordForm")}>
                    List Your Property
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Information Banner */}
          {!isLoading && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Real-Time Listings</h4>
                  <p className="text-sm text-green-700 mt-1">
                    All properties shown here are submitted by verified landlords and updated in real-time. 
                    New listings appear automatically once approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
