import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, ArrowRight, Shield } from "lucide-react";

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
    flexibleCriteria: false,
  });

  const mapRentCastToProperty = (l) => ({
    id: l.id,
    title: l.addressLine1 ?? l.formattedAddress ?? "Rental",
    description: l.propertyType ?? "",
    address: l.addressLine1 ?? "",
    city: l.city ?? "",
    state: l.state ?? "",
    zip_code: l.zipCode ?? "",
    bedrooms: typeof l.bedrooms === "number" ? l.bedrooms : 0,
    bathrooms: typeof l.bathrooms === "number" ? l.bathrooms : 1,
    square_feet: typeof l.squareFootage === "number" ? l.squareFootage : null,
    rent: typeof l.price === "number" ? l.price : 0,
    property_type: (l.propertyType || "apartment").toLowerCase(),
    images: [],
    is_active: l.status === "Active",
    broker_id: "external",

    // These do NOT exist in RentCast. Set defaults so your filters behave.
    accepts_evictions: false,
    accepts_poor_credit: false,
    accepts_criminal_background: false,
    flexible_criteria: false,
  });

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      // Later you can pass city/state from filters instead of hardcoding.
      const params = new URLSearchParams({ city: "New York", state: "NY" });

      const res = await fetch(`/api/rentals?${params.toString()}`);
      if (!res.ok) throw new Error(`API error ${res.status}`);

      const listings = await res.json();

      // listings should be an array
      const arr = Array.isArray(listings) ? listings : [];
      const mapped = arr.map(mapRentCastToProperty).filter((p) => p.is_active);

      setProperties(mapped);
    } catch (error) {
      console.error("Error loading properties:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPropertyDetails = (propertyId) => {
    // We already have the data in memory. Just pick it.
    const hit = properties.find((p) => p.id === propertyId);
    if (hit) setSelectedProperty(hit);
  };

  const applyFilters = useCallback(() => {
    let filtered = properties;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.city?.toLowerCase().includes(loc) ||
          p.state?.toLowerCase().includes(loc) ||
          (p.zip_code ?? "").includes(filters.location)
      );
    }

    if (filters.minRent) {
      const min = Number(filters.minRent);
      if (!Number.isNaN(min)) filtered = filtered.filter((p) => (p.rent ?? 0) >= min);
    }
    if (filters.maxRent) {
      const max = Number(filters.maxRent);
      if (!Number.isNaN(max)) filtered = filtered.filter((p) => (p.rent ?? 0) <= max);
    }

    if (filters.bedrooms !== "") {
      const bedroomFilter = Number(filters.bedrooms);
      if (!Number.isNaN(bedroomFilter)) {
        if (bedroomFilter === 0) {
          filtered = filtered.filter(
            (p) => p.bedrooms === 0 || p.property_type === "studio"
          );
        } else {
          filtered = filtered.filter((p) => (p.bedrooms ?? 0) >= bedroomFilter);
        }
      }
    }

    if (filters.acceptsEvictions) {
      filtered = filtered.filter((p) => p.accepts_evictions);
    }
    if (filters.acceptsPoorCredit) {
      filtered = filtered.filter((p) => p.accepts_poor_credit);
    }
    if (filters.acceptsCriminalBackground) {
      filtered = filtered.filter((p) => p.accepts_criminal_background);
    }
    if (filters.flexibleCriteria) {
      filtered = filtered.filter((p) => p.flexible_criteria);
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle ?id=... after properties load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get("id");
    if (propertyId && properties.length > 0) {
      loadPropertyDetails(propertyId);
    }
  }, [properties]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Available Properties</h1>
        <p className="text-slate-600">
          Find apartments that welcome your application regardless of your background
        </p>
      </div>

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
        <div className="lg:col-span-1">
          <PropertyFilters filters={filters} onFiltersChange={setFilters} />
        </div>

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
              {Array(6)
                .fill(0)
                .map((_, i) => (
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
              <h3 className="text-lg font-medium text-slate-900 mb-2">No properties found</h3>
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
                      flexibleCriteria: false,
                    });
                  }}
                >
                  Clear all filters
                </Button>
                <Button asChild>
                  <Link to={createPageUrl("LandlordForm")}>List Your Property</Link>
                </Button>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Real-Time Listings</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Listings load from your backend in real time.
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