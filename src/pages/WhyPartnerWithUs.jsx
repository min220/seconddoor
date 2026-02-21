import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Handshake, 
  Users, 
  Shield, 
  TrendingUp, 
  Clock, 
  DollarSign,
  CheckCircle,
  Home,
  Star,
  ArrowRight
} from 'lucide-react';

const benefits = [
  {
    icon: Users,
    title: "Access Qualified Tenants",
    description: "Connect with pre-screened tenants who are actively looking for housing and ready to commit to stable rentals.",
    color: "bg-blue-500"
  },
  {
    icon: Shield,
    title: "Reduced Risk",
    description: "Our specialized brokers help you find reliable tenants, even among those with non-traditional backgrounds.",
    color: "bg-green-500"
  },
  {
    icon: Clock,
    title: "Faster Placement",
    description: "Fill vacant units quickly with our network of motivated renters and experienced housing specialists.",
    color: "bg-purple-500"
  },
  {
    icon: DollarSign,
    title: "Maximize Revenue",
    description: "Reduce vacancy periods and maintain consistent rental income with our efficient matching system.",
    color: "bg-amber-500"
  }
];

const stats = [
  {
    number: "95%",
    label: "Tenant Retention Rate",
    description: "Our tenants stay longer because they value the opportunity"
  },
  {
    number: "30%",
    label: "Faster Placement",
    description: "Fill units 30% faster than traditional listing methods"
  },
  {
    number: "500+",
    label: "Active Seekers", 
    description: "Qualified housing seekers in our network"
  },
  {
    number: "50+",
    label: "Partner Brokers",
    description: "Professional brokers working with our platform"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    property: "Downtown Apartments",
    location: "Houston, TX",
    quote: "I was skeptical at first, but Second Door helped me find amazing tenants who others had overlooked. My vacancy rate dropped by 40%.",
    rating: 5
  },
  {
    name: "Mike Rodriguez", 
    property: "Sunset Properties",
    location: "Phoenix, AZ",
    quote: "The brokers really know their clients. They match people with the right properties, leading to longer tenancies and fewer problems.",
    rating: 5
  }
];

export default function WhyPartnerWithUsPage() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
              <Handshake className="w-4 h-4 mr-2" />
              For Property Owners
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold">
              Why Partner With 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"> Second Door?</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Join a revolutionary platform that connects responsible tenants with quality housing. 
              We specialize in finding reliable renters that traditional methods often overlook.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
              >
                <Link to={createPageUrl("LandlordForm")}>
                  List Your Property
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-green-400 text-green-400 hover:bg-green-50 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-slate-900 mb-1">{stat.label}</div>
                <div className="text-sm text-slate-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              The Second Door Advantage
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We're not just another listing site. We're a specialized platform that creates win-win situations for both landlords and tenants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center`}>
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              How It Works for Landlords
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <Home className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold">1. List Your Property</h3>
              <p className="text-slate-600">Submit your property details through our simple form. We review and activate quality listings.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">2. Get Matched</h3>
              <p className="text-slate-600">Our specialized brokers connect you with pre-screened, motivated tenants who fit your criteria.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold">3. Secure Tenants</h3>
              <p className="text-slate-600">Complete applications with confidence knowing tenants are committed and professionally vetted.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              What Landlords Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-1">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-slate-700 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.property}</div>
                    <div className="text-sm text-slate-500">{testimonial.location}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Find Quality Tenants?
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Join Second Door today and discover a better way to fill your rental properties with reliable, appreciative tenants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-green-700 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              <Link to={createPageUrl("LandlordForm")}>
                List Your First Property
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 text-lg"
            >
              <Link to={createPageUrl("SupportCenter")}>
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}