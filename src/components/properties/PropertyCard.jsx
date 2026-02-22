import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Shield, Calendar } from "lucide-react";

export default function PropertyCard({ property, onClick }) {
  const getPropertyTypeLabel = (type) => {
    const labels = {
      apartment: "Apartment",
      house: "House", 
      condo: "Condo",
      townhouse: "Townhouse",
      studio: "Studio",
      duplex: "Duplex"
    };
    return labels[type] || "Property";
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
          onClick={onClick}>
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
        
        <div className="absolute top-4 left-4 flex gap-2">
          {(property.accepts_evictions || property.accepts_poor_credit || property.flexible_criteria || property.accepts_criminal_background) && (
            <Badge className="bg-green-500 text-white border-0">
              <Shield className="w-3 h-3 mr-1" />
              Background Friendly
            </Badge>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-white/90 text-slate-900 font-semibold">
            ${property.rent?.toLocaleString()}/mo
          </Badge>
          <Badge variant="outline" className="bg-white/90 text-slate-700 text-xs">
            {getPropertyTypeLabel(property.property_type)}
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
          {property.bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} bed`}
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
          {property.accepts_criminal_background && (
            <Badge variant="outline" className="text-xs">Criminal Background OK</Badge>
          )}
          {property.flexible_criteria && (
            <Badge variant="outline" className="text-xs">Flexible Criteria</Badge>
          )}
        </div>

        {property.description && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {property.description}
          </p>
        )}

        {property.available_date && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            Available {new Date(property.available_date).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}