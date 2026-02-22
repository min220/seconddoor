import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, MapPin, DollarSign } from "lucide-react";

export default function PropertyList({ properties, onRefresh }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Properties ({properties.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No properties listed
            </h3>
            <p className="text-slate-600">
              Start by adding your first property listing
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-slate-900">
                        {property.title}
                      </h3>
                      <div className="flex gap-2">
                        {property.is_active ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {property.city}, {property.state}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${property.rent?.toLocaleString()}/mo
                      </div>
                      {property.bedrooms && (
                        <span>{property.bedrooms} bed</span>
                      )}
                      {property.bathrooms && (
                        <span>{property.bathrooms} bath</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
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

                    {property.description && (
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {property.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}