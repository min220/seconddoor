import React, { useState, useEffect } from "react";
import { Property, Broker, User } from "@/mock/base44";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Plus, 
  Home, 
  MessageSquare, 
  BarChart3,
  FileText,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import PropertyUpload from "../components/broker/PropertyUpload";
import PropertyList from "../components/broker/PropertyList";
import BrokerStats from "../components/broker/BrokerStats";

export default function BrokerDashboardPage() {
  const [user, setUser] = useState(null);
  const [brokerProfile, setBrokerProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Check if user has a broker profile
      const brokers = await Broker.filter({ email: currentUser.email });
      if (brokers.length > 0) {
        setBrokerProfile(brokers[0]);
        // Load broker's properties
        const brokerProperties = await Property.filter({ 
          broker_id: brokers[0].id 
        }, '-created_date');
        setProperties(brokerProperties);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const handlePropertyAdded = () => {
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid md:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!brokerProfile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Broker Profile Required
          </h2>
          <p className="text-slate-600 mb-6">
            You need to have a verified broker profile to access the dashboard.
          </p>
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Contact support to set up your broker profile and get verified.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Broker Dashboard
        </h1>
        <p className="text-slate-600">
          Welcome back, {brokerProfile.name}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "properties", label: "Properties", icon: Home },
              { id: "upload", label: "Add Properties", icon: Plus },
              { id: "messages", label: "Messages", icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <BrokerStats 
          brokerProfile={brokerProfile}
          properties={properties}
        />
      )}

      {activeTab === "properties" && (
        <PropertyList 
          properties={properties}
          onRefresh={loadDashboardData}
        />
      )}

      {activeTab === "upload" && (
        <PropertyUpload 
          brokerId={brokerProfile.id}
          onPropertyAdded={handlePropertyAdded}
        />
      )}

      {activeTab === "messages" && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Messages Coming Soon
          </h3>
          <p className="text-slate-600">
            Message management functionality will be available soon.
          </p>
        </div>
      )}
    </div>
  );
}