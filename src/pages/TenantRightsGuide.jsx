import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Home, AlertTriangle } from 'lucide-react';

export default function TenantRightsGuidePage() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900">Tenant Rights Guide</h1>
          <p className="text-lg text-slate-600 mt-2">
            Knowledge is power. Understand your rights as a tenant.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-green-700" />
                The Lease Agreement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>Your lease is a legally binding contract. Read it carefully before signing. Key things to look for include: rent amount and due date, lease term (length), security deposit details, rules and regulations, and landlord's right to enter the property.</p>
              <p>You have the right to a written lease. If you only have a verbal agreement, it can be harder to enforce your rights.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-6 h-6 text-green-700" />
                Right to a Habitable Home
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>Landlords are required to provide a safe and habitable living environment. This is often called the "implied warranty of habitability." This includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Working plumbing and heating</li>
                <li>Safe electrical systems</li>
                <li>Structurally sound buildings (roof, floors, walls)</li>
                <li>No infestations of pests like rodents or insects</li>
                <li>Functioning smoke and carbon monoxide detectors</li>
              </ul>
              <p>If your home is not habitable, you must notify your landlord in writing and give them a reasonable amount of time to make repairs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-green-700" />
                Eviction Protections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>A landlord cannot simply lock you out or throw your belongings on the street. They must follow a legal eviction process, which typically involves:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Providing you with a written notice to "cure" the issue (e.g., pay rent) or "quit" (move out).</li>
                <li>If you don't comply, they must file a lawsuit in court.</li>
                <li>You have the right to appear in court and defend yourself.</li>
                <li>Only a court order can force you to move, and only a law enforcement officer can legally remove you.</li>
              </ol>
              <p>Retaliatory evictions (e.g., your landlord tries to evict you for reporting a code violation) are illegal.</p>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-slate-500 pt-8">
            <p><strong>Disclaimer:</strong> This is a general guide and not legal advice. Laws vary by state and city. Consult with a local tenant's rights organization or an attorney for advice on your specific situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}