
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Search, MessageSquare, User, Users, Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Browse Properties",
    url: createPageUrl("Properties"),
    icon: Search,
  },
  {
    title: "Find Brokers",
    url: createPageUrl("Brokers"),
    icon: Users,
  },
  {
    title: "Messages",
    url: createPageUrl("Messages"),
    icon: MessageSquare,
  },
  {
    title: "My Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavLinks = ({ mobile = false, onItemClick }) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.title}
          to={item.url}
          onClick={onItemClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            location.pathname === item.url
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          } ${mobile ? 'w-full' : ''}`}
        >
          <item.icon className="w-4 h-4" />
          {item.title}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style jsx>{`
        :root {
          --primary: #1e293b;
          --secondary: #16a34a; /* Updated from amber #f59e0b to green */
          --accent: #0f172a;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Second Door</h1>
                <p className="text-xs text-slate-500 -mt-1">Housing Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 pt-8">
                  <NavLinks mobile onItemClick={() => setMobileMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">Second Door</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Connecting specialized brokers with clients who have unconventional backgrounds to find quality housing solutions.
              </p>
            </div>
            
            <div className="md:col-start-2">
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("Properties")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Browse Properties
                </Link>
                <Link to={createPageUrl("Brokers")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Find Brokers
                </Link>
                <Link to={createPageUrl("CreateProfile")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Create Profile
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("TenantRightsGuide")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Tenant Rights Guide
                </Link>
                <Link to={createPageUrl("CreditRepairTips")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Credit Repair Tips
                </Link>
                <Link to={createPageUrl("SupportCenter")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Support Center
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Landlords</h4>
              <div className="space-y-2">
                <Link to={createPageUrl("LandlordForm")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  List Your Property
                </Link>
                <Link to={createPageUrl("WhyPartnerWithUs")} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  Why Partner With Us?
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 Second Door. All rights reserved. Connecting communities, one home at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
