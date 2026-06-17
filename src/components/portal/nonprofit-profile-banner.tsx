"use client";

import { Building2, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NonprofitProfile } from "@/types";
import { formatNonprofitUsd } from "@/lib/nonprofit-program";

interface NonprofitProfileBannerProps {
  profile: NonprofitProfile;
}

export function NonprofitProfileBanner({ profile }: NonprofitProfileBannerProps) {
  return (
    <Card className="border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="bg-violet-600 hover:bg-violet-600">
                  Non-Profit Organization
                </Badge>
                <Badge variant="info">EIN {profile.ein}</Badge>
              </div>
              <h2 className="mt-2 text-lg font-bold text-slate-900">
                {profile.organizationLegalName}
              </h2>
              {profile.dbaName && (
                <p className="text-sm text-slate-500">DBA: {profile.dbaName}</p>
              )}
              <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
                {profile.missionStatement}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-violet-100 bg-white/80 p-4 sm:min-w-[220px]">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4 text-violet-600" />
              <span>Authorized: {profile.representativeName}</span>
            </div>
            <p className="text-xs text-slate-500">{profile.representativeTitle}</p>
            <div className="mt-2 border-t border-violet-100 pt-2">
              <p className="text-xs text-slate-500">Enrolled fund capital</p>
              <p className="text-lg font-bold text-slate-900">
                {formatNonprofitUsd(profile.fundCapital)}
              </p>
              <p className="text-sm font-semibold text-violet-700">
                {profile.monthlyRate}% monthly profit rate
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
