import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart, CheckSquare, Target } from 'lucide-react';

export default function CreditRepairTipsPage() {
  return (
    <div className="bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <TrendingUp className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900">Credit Repair Tips</h1>
          <p className="text-lg text-slate-600 mt-2">
            Take control of your financial future with these actionable steps.
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-6 h-6 text-green-700" />
                1. Check Your Credit Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>You are entitled to a free credit report from each of the three major credit bureaus (Equifax, Experian, and TransUnion) once a year. Get your reports from AnnualCreditReport.com, the only federally authorized source.</p>
              <p>Review each report carefully for errors, such as accounts that aren't yours, incorrect payment statuses, or outdated negative information.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-6 h-6 text-green-700" />
                2. Dispute Errors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>If you find errors, dispute them immediately. You can file disputes online through the websites of the three credit bureaus. Provide clear explanations and include any documentation you have to support your claim.</p>
              <p>The credit bureau has about 30 days to investigate and must remove any information it cannot verify.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-green-700" />
                3. Pay Your Bills On Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <p>Payment history is the single biggest factor affecting your credit score. Even one late payment can have a significant negative impact. Set up automatic payments or reminders to ensure you never miss a due date.</p>
              <p>If you're behind on payments, catch up as quickly as possible. Every on-time payment helps to build a positive history.</p>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-slate-500 pt-8">
            <p><strong>Disclaimer:</strong> This is for informational purposes only and is not financial advice. Building credit takes time and consistent effort. Consider speaking with a non-profit credit counselor for personalized guidance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}