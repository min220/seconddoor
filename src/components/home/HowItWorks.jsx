
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Home, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description: "Browse apartments that welcome applicants with diverse backgrounds and circumstances.",
    color: "bg-blue-500"
  },
  {
    icon: Users,
    title: "Connect with Brokers",
    description: "Get matched with verified brokers who specialize in your specific situation.",
    color: "bg-teal-500" // Changed from bg-amber-500 to bg-teal-500
  },
  {
    icon: MessageSquare,
    title: "Secure Communication",
    description: "Discuss your needs privately and get personalized housing solutions.",
    color: "bg-green-500"
  },
  {
    icon: Home,
    title: "Find Your Home",
    description: "Complete your application with confidence and move into your new home.",
    color: "bg-purple-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
          How It Works
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Our simple process connects you with the right housing opportunities in just a few steps
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center space-y-6">
                <div className="relative">
                  <div className={`w-16 h-16 ${step.color} rounded-full mx-auto flex items-center justify-center`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
