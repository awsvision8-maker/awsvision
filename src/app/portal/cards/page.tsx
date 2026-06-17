"use client";

import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCardVisual } from "@/components/marketing/credit-card-visual";
import { CREDIT_CARD_PRODUCTS } from "@/lib/credit-cards-data";

export default function CardsPage() {
  return (
    <>
      <PortalHeader
        title="Credit Cards"
        subtitle="Preview our upcoming Visa card lineup — launching soon"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Credit cards launching soon</p>
                <p className="mt-1 text-sm text-slate-600">
                  Applications are not yet open. Preview all AWS Vision cards below and join the
                  waitlist to be notified at launch.
                </p>
              </div>
            </div>
            <Link href="/contact#notify">
              <Button>
                <Bell className="h-4 w-4" />
                Join Waitlist
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {CREDIT_CARD_PRODUCTS.map((card) => (
            <Card key={card.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <CreditCardVisual card={card} className="mx-auto sm:mx-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="warning">Launching Soon</Badge>
                      <Badge>{card.annualFee === "$0" ? "No Annual Fee" : `${card.annualFee}/yr`}</Badge>
                    </div>
                    <h3 className="mt-3 font-bold text-slate-900">{card.name}</h3>
                    <p className="text-sm text-teal-700">{card.tagline}</p>
                    <ul className="mt-3 space-y-1">
                      {card.features.slice(0, 3).map((f) => (
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
            Want to be first to apply?{" "}
            <Link href="/contact#notify" className="font-medium text-teal-600 hover:underline">
              Join the credit card waitlist
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
