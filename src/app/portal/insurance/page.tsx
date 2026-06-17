"use client";

import Link from "next/link";
import { Bell, Sparkles } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Umbrella } from "lucide-react";

const INSURANCE_PRODUCTS = [
  { id: "life", name: "Life Insurance", icon: Heart, premium: "From $29/mo", desc: "Protect your family with comprehensive life coverage." },
  { id: "health", name: "Health Insurance", icon: Shield, premium: "From $149/mo", desc: "Premium health plans with global coverage." },
  { id: "investment", name: "Investment Protection", icon: Umbrella, premium: "From 0.5% of portfolio", desc: "Insure your investment portfolio against downturns." },
];

export default function InsurancePage() {
  return (
    <>
      <PortalHeader
        title="Insurance"
        subtitle="Preview our upcoming insurance products — opening soon"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card className="border-teal-200 bg-teal-50">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Insurance opening soon</p>
                <p className="mt-1 text-sm text-slate-600">
                  Life, health, and portfolio protection are not yet available. Open a Savings, FD,
                  or Investment account today, or join the waitlist.
                </p>
              </div>
            </div>
            <Link href="/contact#coming-soon">
              <Button>
                <Bell className="h-4 w-4" />
                Join Waitlist
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {INSURANCE_PRODUCTS.map((ins) => (
            <Card key={ins.id}>
              <CardContent className="pt-6">
                <Badge variant="warning" className="mb-3">Opening Soon</Badge>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                  <ins.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{ins.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{ins.desc}</p>
                <p className="mt-4 text-sm"><span className="text-slate-400">From:</span> <span className="font-medium">{ins.premium}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
