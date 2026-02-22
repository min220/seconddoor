import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    location: "Atlanta, GA", 
    situation: "Eviction History",
    rating: 5,
    content: "After three rejections, I found Maria through SecondChance. She understood my situation and found me a beautiful apartment within two weeks. The landlord was willing to work with my eviction history.",
    broker: "Maria Rodriguez"
  },
  {
    name: "James K.",
    location: "Houston, TX",
    situation: "Criminal Background", 
    rating: 5,
    content: "I thought I'd never find a decent place with my background. David connected me with a landlord who looked at the whole person, not just my past. I've been in my apartment for 8 months now.",
    broker: "David Chen"
  },
  {
    name: "Lisa R.",
    location: "Phoenix, AZ",
    situation: "Poor Credit",
    rating: 5,
    content: "My credit score was 480, but Jennifer found multiple options for me. She negotiated with landlords and helped me understand what I could do to improve my situation. Professional and caring.",
    broker: "Jennifer Walsh"
  }
];

export default function Testimonials() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
          Success Stories
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real stories from clients who found their homes through our platform
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            {/* Decorative Quote */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-12 h-12 text-slate-400" />
            </div>
            
            <CardContent className="p-8 space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-slate-700 leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>

              {/* Author Info */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.location}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.situation}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Broker:</span> {testimonial.broker}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}