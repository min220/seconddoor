import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Eye, MessageSquare, TrendingUp, Star, Award } from "lucide-react";

export default function BrokerStats({ brokerProfile, properties }) {
  const activeProperties = properties.filter(p => p.is_active).length;
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const avgRent = properties.length > 0 
    ? properties.reduce((sum, p) => sum + (p.rent || 0), 0) / properties.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProperties}</div>
            <p className="text-xs text-muted-foreground">
              {properties.length - activeProperties} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Across all listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgRent.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brokerProfile.rating || 5.0}</div>
            <p className="text-xs text-muted-foreground">
              {brokerProfile.review_count || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification Status</span>
            <Badge className={brokerProfile.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
              {brokerProfile.is_verified ? "Verified" : "Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Award className="w-3 h-3 mr-1" />
                {brokerProfile.success_rate || 0}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience</span>
            <span className="text-sm text-slate-600">
              {brokerProfile.years_experience || 0} years
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Specializations</span>
            <div className="flex flex-wrap gap-1">
              {brokerProfile.specializations?.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="outline" className="text-xs">
                  {spec.replace(/_/g, ' ')}
                </Badge>
              ))}
              {brokerProfile.specializations?.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{brokerProfile.specializations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{property.title}</p>
                  <p className="text-xs text-slate-500">
                    Listed {new Date(property.created_date).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={property.is_active ? "default" : "secondary"}>
                  {property.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
            {properties.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}