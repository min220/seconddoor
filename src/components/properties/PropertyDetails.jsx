
import React, { useState, useEffect, useCallback } from "react";
import { Broker, Message } from "@entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign,
  Calendar,
  Shield,
  Star,
  MessageSquare,
  Send
} from "lucide-react";

const isValidId = (id) => /^[a-f\d]{24}$/i.test(id);

export default function PropertyDetails({ property, onBack }) {
  const [broker, setBroker] = useState(null);
  const [brokerLoading, setBrokerLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBroker = useCallback(async () => {
    if (!property.broker_id || !isValidId(property.broker_id)) {
      console.warn(`Invalid or missing broker_id: ${property.broker_id}. Using fallback.`);
      setBroker({
        name: "Property Manager",
        company: "Second Door Properties",
        phone: "(555) 000-0000",
        email: "info@seconddoor.com"
      });
      return;
    }
    
    setBrokerLoading(true);
    try {
      const brokers = await Broker.filter({ id: property.broker_id });
      if (brokers.length > 0) {
        setBroker(brokers[0]);
      } else {
        console.warn(`Broker with ID ${property.broker_id} not found`);
        // Set a default broker info if broker not found
        setBroker({
          name: "Property Manager",
          company: "Second Door Properties",
          phone: "(555) 000-0000",
          email: "info@seconddoor.com"
        });
      }
    } catch (error) {
      console.error("Error loading broker:", error);
      // Set fallback broker info on error
      setBroker({
        name: "Property Manager", 
        company: "Second Door Properties",
        phone: "(555) 000-0000",
        email: "info@seconddoor.com"
      });
    }
    setBrokerLoading(false);
  }, [property.broker_id]);

  useEffect(() => {
    // The check inside loadBroker handles the validation, so we just call it if broker_id exists
    // The `property.broker_id` being present is a prerequisite for attempting to load,
    // and `loadBroker` itself then validates its format.
    if (property.broker_id) {
      loadBroker();
    }
  }, [property.broker_id, loadBroker]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await Message.create({
        sender_id: "guest", // In a real app, this would be the current user's ID
        recipient_id: property.broker_id || "default", // Fallback for recipient if broker_id is somehow missing here
        property_id: property.id,
        subject: `Inquiry about ${property.title}`,
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
        Back to Properties
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Images */}
          <Card className="overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              {property.images && property.images.length > 0 ? (
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400">
                  <Square className="w-24 h-24" />
                </div>
              )}
            </div>
          </Card>

          {/* Property Info */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl text-slate-900">
                    {property.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-slate-600 mt-2">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                  <div className="text-slate-600">
                    {property.city}, {property.state} {property.zip_code}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">
                    ${property.rent?.toLocaleString()}/mo
                  </div>
                  {property.security_deposit && (
                    <div className="text-slate-600">
                      ${property.security_deposit?.toLocaleString()} deposit
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-slate-600" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-slate-600" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                )}
                {property.square_feet && (
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-slate-600" />
                    <span>{property.square_feet} sqft</span>
                  </div>
                )}
                {property.available_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <span>Available {new Date(property.available_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Special Criteria Badges */}
              <div className="flex flex-wrap gap-2">
                {property.accepts_evictions && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Eviction History OK
                  </Badge>
                )}
                {property.accepts_poor_credit && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Poor Credit OK
                  </Badge>
                )}
                {property.accepts_criminal_background && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Criminal Background OK
                  </Badge>
                )}
                {property.flexible_criteria && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Flexible Criteria
                  </Badge>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-slate-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Broker Info */}
          {broker && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listed by</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brokerLoading && isValidId(property.broker_id) ? ( // Only show skeleton if loading and ID is valid
                  <div className="animate-pulse">
                    <div className="h-12 bg-slate-200 rounded mb-2" />
                    <div className="h-4 bg-slate-200 rounded mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                        {broker.profile_image ? (
                          <img 
                            src={broker.profile_image} 
                            alt={broker.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-semibold text-slate-600">
                            {broker.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{broker.name}</div>
                        <div className="text-sm text-slate-600">{broker.company}</div>
                      </div>
                    </div>

                    {broker.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{broker.rating}</span>
                        </div>
                        <span className="text-sm text-slate-600">
                          ({broker.review_count || 0} reviews)
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {broker.specializations?.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact About This Property</CardTitle>
            </CardHeader>
            <CardContent>
              {!showContactForm ? (
                <Button 
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
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
                      placeholder="I'm interested in this property..."
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
