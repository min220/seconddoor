
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Shield, Heart, Users } from "lucide-react";

export default function HeroSection({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery, location);
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Trusted Housing Solutions
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Open Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Second Door</span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed">
                Connect with specialized brokers who understand your unique situation. 
                Find quality housing regardless of your background or credit history.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">500+</div>
                <div className="text-slate-400 text-sm">Properties Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">50+</div>
                <div className="text-slate-400 text-sm">Verified Brokers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">95%</div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                <Heart className="w-3 h-3 mr-2" />
                Eviction Friendly
              </Badge>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                <Users className="w-3 h-3 mr-2" />
                Credit Flexible
              </Badge>
              <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                <Shield className="w-3 h-3 mr-2" />
                Background Friendly
              </Badge>
            </div>
          </div>

          {/* Right Content - Search Card */}
          <div className="lg:pl-8">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Start Your Housing Search
                  </h3>
                  <p className="text-slate-600">
                    Find apartments that welcome your application
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="What type of apartment are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 text-lg border-slate-200 focus:border-green-400 focus:ring-green-400"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="City, State or ZIP code"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-12 h-12 text-lg border-slate-200 focus:border-green-400 focus:ring-green-400"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
                  >
                    Search Properties
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-center text-slate-600 text-sm mb-4">
                    Or browse by specialization:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Eviction History
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Poor Credit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Criminal Background
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      Self-Employed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
