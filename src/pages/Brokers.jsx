import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";

import BrokerFilters from "../components/brokers/BrokerFilters";
import BrokerCard from "../components/brokers/BrokerCard";
import BrokerDetails from "../components/brokers/BrokerDetails";

const MOCK_BROKERS = [
  {
    id: "b1",
    name: "Jordan Lee",
    company: "NYC Second Chance Realty",
    phone: "555-123-4567",
    email: "jordan@example.com",
    bio: "Specializes in rentals with flexible criteria.",
    specializations: ["poor_credit", "no_credit", "self_employed"],
    areas_served: ["Manhattan", "Brooklyn", "Queens"],
    years_experience: 6,
    success_rate: 78,
    profile_image: "",
    rating: 4.6,
    review_count: 42,
    is_verified: true,
  },
  {
    id: "b2",
    name: "Sam Patel",
    company: "Bridge Apartments",
    phone: "555-987-6543",
    email: "sam@example.com",
    bio: "Works with Section 8 and first-time renters.",
    specializations: ["section_8", "first_time_renters"],
    areas_served: ["Bronx", "Queens"],
    years_experience: 4,
    success_rate: 70,
    profile_image: "",
    rating: 4.2,
    review_count: 18,
    is_verified: false,
  },
];

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
    isVerified: false,
  });

  const loadBrokers = async () => {
    setIsLoading(true);
    try {
      // TEMP: local mock data until a backend exists
      setBrokers(MOCK_BROKERS);
    } catch (error) {
      console.error("Error loading brokers:", error);
    }
    setIsLoading(false);
  };

  const loadBrokerDetails = async (brokerId) => {
    try {
      const found = MOCK_BROKERS.find((b) => b.id === brokerId);
      if (found) setSelectedBroker(found);
    } catch (error) {
      console.error("Error loading broker details:", error);
    }
  };

  const applyFilters = () => {
    let filtered = brokers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (broker) =>
          broker.name?.toLowerCase().includes(q) ||
          broker.company?.toLowerCase().includes(q) ||
          broker.specializations?.some((spec) => spec.toLowerCase().includes(q))
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((broker) =>
        broker.areas_served?.some((area) => area.toLowerCase().includes(loc))
      );
    }

    if (filters.specializations.length > 0) {
      filtered = filtered.filter((broker) =>
        filters.specializations.some((spec) => broker.specializations?.includes(spec))
      );
    }

    if (filters.minRating) {
      const min = Number.parseFloat(filters.minRating);
      filtered = filtered.filter((broker) => (broker.rating || 0) >= min);
    }

    if (filters.isVerified) {
      filtered = filtered.filter((broker) => broker.is_verified);
    }

    setFilteredBrokers(filtered);
  };

  useEffect(() => {
    loadBrokers();

    const urlParams = new URLSearchParams(window.location.search);
    const brokerId = urlParams.get("id");
    if (brokerId) loadBrokerDetails(brokerId);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [brokers, searchQuery, filters]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Find Specialized Brokers
        </h1>
        <p className="text-slate-600">
          Connect with verified professionals who understand your unique housing needs
        </p>
      </div>

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
        <div className="lg:col-span-1">
          <BrokerFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-600">
              {isLoading ? "Loading..." : `${filteredBrokers.length} brokers found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
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
                    isVerified: false,
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