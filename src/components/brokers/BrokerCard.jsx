import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, ArrowRight, Shield, Users } from "lucide-react";

export default function BrokerCard({ broker, onClick }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
          onClick={onClick}>
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
          {broker.years_experience && (
            <p className="text-xs text-slate-500 mt-1">
              {broker.years_experience} years experience
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{broker.rating || 5.0}</span>
          <span className="text-xs text-slate-500">({broker.review_count || 0} reviews)</span>
        </div>

        {broker.success_rate && (
          <div className="text-center">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Award className="w-3 h-3 mr-1" />
              {broker.success_rate}% Success Rate
            </Badge>
          </div>
        )}

        <div className="flex flex-wrap gap-1 justify-center">
          {broker.specializations?.slice(0, 3).map((spec) => (
            <Badge key={spec} variant="outline" className="text-xs">
              {spec.replace(/_/g, ' ')}
            </Badge>
          ))}
          {broker.specializations?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{broker.specializations.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
          <MapPin className="w-3 h-3" />
          <span>{broker.areas_served?.slice(0, 2).join(', ')}</span>
          {broker.areas_served?.length > 2 && <span> +{broker.areas_served.length - 2}</span>}
        </div>

        <Button 
          size="sm" 
          className="w-full bg-slate-900 hover:bg-slate-800 text-white group/btn"
        >
          View Profile
          <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}