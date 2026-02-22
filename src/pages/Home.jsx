
import React, { useState, useEffect } from "react";
import { Property, Broker } from "@/mock/base44";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  MapPin, 
  Users, 
  Shield, 
  Heart, 
  Star,
  ArrowRight,
  Home as HomeIcon,
  CheckCircle
} from "lucide-react";

import HeroSection from "../components/home/HeroSection";
import SearchBar from "../components/home/SearchBar";
import FeaturedProperties from "../components/home/FeaturedProperties";
import TopBrokers from "../components/home/TopBrokers";
import HowItWorks from "../components/home/HowItWorks";
import Testimonials from "../components/home/Testimonials";

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propertiesData, brokersData] = await Promise.all([
        Property.filter({ is_active: true }, '-created_date', 6),
        Broker.filter({ is_verified: true }, '-rating', 4)
      ]);
      setProperties(propertiesData);
      setBrokers(brokersData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleSearch = (query, location) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (location) searchParams.set('location', location);
    
    // Using window.location to navigate as Link component might not be available here
    window.location.href = createPageUrl(`Properties?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        <FeaturedProperties properties={properties} isLoading={isLoading} />
        <TopBrokers brokers={brokers} isLoading={isLoading} />
        <HowItWorks />
        <Testimonials />
      </div>
    </div>
  );
}
