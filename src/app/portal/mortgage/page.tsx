"use client";

import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoanProductVisual } from "@/components/marketing/loan-product-visual";
import { getLoansByCategory } from "@/lib/loans-data";

const HOME_LOANS = getLoansByCategory("home");

export default function MortgagePage() {
  return (
    <>
      <PortalHeader
        title="Mortgage & Home Loans"
        subtitle="Preview our upcoming home lending products — launching soon"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Mortgage facility launching soon</p>
                <p className="mt-1 text-sm text-slate-600">
                  Home purchase, refinance, and HELOC applications are not yet open. Preview our mortgage
                  lineup and join the waitlist to be notified when lending launches.
                </p>
              </div>
            </div>
            <Link href="/contact#loan-notify">
              <Button>
                <Bell className="h-4 w-4" />
                Join Waitlist
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {HOME_LOANS.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <LoanProductVisual product={product} className="mx-auto sm:mx-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">Launching Soon</Badge>
                      <Badge>{product.rateLabel}</Badge>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900">{product.name}</h3>
                    <p className="text-sm text-teal-700">{product.tagline}</p>
                    <ul className="mt-3 space-y-1">
                      {product.features.map((f) => (
                        <li key={f} className="text-xs text-slate-600">• {f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm text-slate-600">
            Full details on our public site:{" "}
            <Link href="/home-loans" className="font-medium text-teal-600 hover:underline">
              Home Loans & Mortgage
            </Link>
            {" · "}
            <Link href="/contact#loan-notify" className="font-medium text-teal-600 hover:underline">
              Join the loan waitlist
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
