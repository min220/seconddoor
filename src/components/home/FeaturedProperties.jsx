
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapPin, Bed, Bath, Square, ArrowRight, Shield } from "lucide-react";

export default function FeaturedProperties({ properties, isLoading }) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
          Featured Properties
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Quality apartments from brokers who specialize in working with clients with diverse backgrounds
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <div className="relative">
              <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400">
                    <Square className="w-12 h-12" />
                  </div>
                )}
              </div>
              
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white border-0">
                  <Shield className="w-3 h-3 mr-1" />
                  Background Friendly
                </Badge>
              </div>
              
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-white/90 text-slate-900 font-semibold">
                  ${property.rent?.toLocaleString()}/mo
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.city}, {property.state}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600">
                {property.bedrooms && (
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {property.bedrooms} bed
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms} bath
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-1">
                    <Square className="w-4 h-4" />
                    {property.square_feet} sqft
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {property.accepts_evictions && (
                  <Badge variant="outline" className="text-xs">Eviction OK</Badge>
                )}
                {property.accepts_poor_credit && (
                  <Badge variant="outline" className="text-xs">Poor Credit OK</Badge>
                )}
                {property.flexible_criteria && (
                  <Badge variant="outline" className="text-xs">Flexible Criteria</Badge>
                )}
              </div>

              <Button 
                asChild 
                className="w-full bg-green-700 hover:bg-green-600 text-white group"
              >
                <Link to={createPageUrl(`Properties?id=${property.id}`)}>
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          asChild 
          variant="outline" 
          size="lg"
          className="border-green-500 text-green-700 hover:bg-green-50"
        >
          <Link to={createPageUrl("Properties")}>
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
