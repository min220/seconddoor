import React, { useState, useEffect } from "react";
import { Property, Message } from "@entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Shield,
  Award,
  MessageSquare,
  Send,
  Phone,
  Mail,
  Building2,
  Users
} from "lucide-react";

export default function BrokerDetails({ broker, onBack }) {
  const [brokerProperties, setBrokerProperties] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBrokerProperties();
  }, [broker.id]);

  const loadBrokerProperties = async () => {
    try {
      const properties = await Property.filter({ broker_id: broker.id, is_active: true });
      setBrokerProperties(properties);
    } catch (error) {
      console.error("Error loading broker properties:", error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Message.create({
        sender_id: "guest",
        recipient_id: broker.id,
        subject: `General Inquiry for ${broker.name}`,
        content: `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage: ${message}`,
        message_type: "inquiry"
      });

      setShowContactForm(false);
      setMessage("");
      setContactName("");
      setContactEmail("");
      alert("Your message has been sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 hover:bg-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Brokers
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Broker Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                    {broker.profile_image ? (
                      <img 
                        src={broker.profile_image} 
                        alt={broker.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-slate-600">
                        {broker.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  {broker.is_verified && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-500 text-white border-0 rounded-full p-2">
                        <Shield className="w-4 h-4" />
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <CardTitle className="text-2xl text-slate-900 mb-2">
                    {broker.name}
                  </CardTitle>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <span>{broker.company}</span>
                    </div>
                    {broker.license_number && (
                      <div className="text-sm text-slate-500">
                        License: {broker.license_number}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium">{broker.rating || 5.0}</span>
                        <span className="text-sm text-slate-500">
                          ({broker.review_count || 0} reviews)
                        </span>
                      </div>
                      {broker.success_rate && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Award className="w-3 h-3 mr-1" />
                          {broker.success_rate}% Success
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bio */}
              {broker.bio && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                  <p className="text-slate-700 leading-relaxed">{broker.bio}</p>
                </div>
              )}

              {/* Specializations */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {broker.specializations?.map((spec) => (
                    <Badge key={spec} className="bg-green-100 text-green-800 border-green-200">
                      {spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Areas Served */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Areas Served</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-600 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {broker.areas_served?.map((area, index) => (
                      <span key={index} className="text-slate-700">
                        {area}{index < broker.areas_served.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience */}
              {broker.years_experience && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {broker.years_experience}
                    </div>
                    <div className="text-slate-600">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {brokerProperties.length}
                    </div>
                    <div className="text-slate-600">Active Listings</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Properties */}
          {brokerProperties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Listings ({brokerProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {brokerProperties.slice(0, 3).map((property) => (
                    <div key={property.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-slate-900">{property.title}</h4>
                          <p className="text-sm text-slate-600">{property.city}, {property.state}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                            {property.bedrooms && <span>{property.bedrooms} bed</span>}
                            {property.bathrooms && <span>{property.bathrooms} bath</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">
                            ${property.rent?.toLocaleString()}/mo
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {brokerProperties.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" size="sm">
                        View all {brokerProperties.length} properties
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-600" />
                <span className="text-slate-900">{broker.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-600" />
                <span className="text-slate-900">{broker.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Message</CardTitle>
            </CardHeader>
            <CardContent>
              {!showContactForm ? (
                <Button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Broker
                </Button>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell the broker about your housing needs..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}