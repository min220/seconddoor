import React, { useState, useEffect } from "react";
import { Broker } from "@/entities/all";
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
  Star, 
  Shield, 
  Filter,
  ArrowRight,
  Users
} from "lucide-react";

import BrokerFilters from "../components/brokers/BrokerFilters";
import BrokerCard from "../components/brokers/BrokerCard";
import BrokerDetails from "../components/brokers/BrokerDetails";

export default function BrokersPage() {
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    specializations: [],
    minRating: "",
    isVerified: false
  });

  useEffect(() => {
    loadBrokers();
    
    // Check if there's a specific broker ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const brokerId = urlParams.get('id');
    if (brokerId) {
      loadBrokerDetails(brokerId);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [brokers, searchQuery, filters]);

  const loadBrokers = async () => {
    setIsLoading(true);
    try {
      const data = await Broker.list('-rating', 50);
      setBrokers(data);
    } catch (error) {
      console.error("Error loading brokers:", error);
    }
    setIsLoading(false);
  };

  const loadBrokerDetails = async (brokerId) => {
    try {
      const brokers = await Broker.filter({ id: brokerId });
      if (brokers.length > 0) {
        setSelectedBroker(brokers[0]);
      }
    } catch (error) {
      console.error("Error loading broker details:", error);
    }
  };

  const applyFilters = () => {
    let filtered = brokers;

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(broker => 
        broker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broker.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        broker.specializations?.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(broker =>
        broker.areas_served?.some(area =>
          area.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    // Specializations filter
    if (filters.specializations.length > 0) {
      filtered = filtered.filter(broker =>
        filters.specializations.some(spec =>
          broker.specializations?.includes(spec)
        )
      );
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter(broker => 
        (broker.rating || 0) >= parseFloat(filters.minRating)
      );
    }

    // Verified filter
    if (filters.isVerified) {
      filtered = filtered.filter(broker => broker.is_verified);
    }

    setFilteredBrokers(filtered);
  };

  if (selectedBroker) {
    return (
      <BrokerDetails 
        broker={selectedBroker} 
        onBack={() => setSelectedBroker(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Find Specialized Brokers
        </h1>
        <p className="text-slate-600">
          Connect with verified professionals who understand your unique housing needs
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search by broker name, company, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <BrokerFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Brokers Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading ? "Loading..." : `${filteredBrokers.length} brokers found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrokers.map((broker) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  onClick={() => setSelectedBroker(broker)}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredBrokers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No brokers found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    location: "",
                    specializations: [],
                    minRating: "",
                    isVerified: false
                  });
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}