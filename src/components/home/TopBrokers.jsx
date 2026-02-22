
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Star, MapPin, Award, ArrowRight, Shield } from "lucide-react";

export default function TopBrokers({ brokers, isLoading }) {
  if (isLoading) {
    return (
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
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
          Top-Rated Brokers
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Connect with verified professionals who specialize in helping clients with unique circumstances
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {brokers.map((broker) => (
          <Card key={broker.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto flex items-center justify-center">
                  {broker.profile_image ? (
                    <img 
                      src={broker.profile_image} 
                      alt={broker.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-slate-600">
                      {broker.name?.charAt(0)}
                    </span>
                  )}
                </div>
                {broker.is_verified && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-blue-500 text-white border-0 rounded-full p-1">
                      <Shield className="w-3 h-3" />
                    </Badge>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                  {broker.name}
                </h3>
                <p className="text-sm text-slate-600">{broker.company}</p>
              </div>

              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-green-400 text-green-400" />
                <span className="text-sm font-medium">{broker.rating || 5.0}</span>
                <span className="text-xs text-slate-500">({broker.review_count || 0} reviews)</span>
              </div>

              <div className="flex flex-wrap gap-1 justify-center">
                {broker.specializations?.slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
                <MapPin className="w-3 h-3" />
                <span>{broker.areas_served?.slice(0, 2).join(', ')}</span>
              </div>

              <Button 
                asChild 
                size="sm" 
                className="w-full bg-green-700 hover:bg-green-600 text-white group"
              >
                <Link to={createPageUrl(`Brokers?id=${broker.id}`)}>
                  View Profile
                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
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
          className="border-green-500 text-green-700 hover:bg-green-100"
        >
          <Link to={createPageUrl("Brokers")}>
            View All Brokers
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
