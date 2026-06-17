"use client";

import { Download, FileText } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { usePortfolio } from "@/lib/use-portfolio";
import { generateStatementPDF } from "@/lib/pdf-generator";
import { formatCurrency } from "@/lib/utils";

export default function StatementsPage() {
  const { user } = useAuth();
  const portfolio = usePortfolio();

  const handleDownload = (statementId: string) => {
    const statement = portfolio.statements.find((s) => s.id === statementId);
    if (statement && user) {
      generateStatementPDF(statement, user, portfolio.transactions);
    }
  };

  return (
    <>
      <PortalHeader
        title="Monthly Statements"
        subtitle="Download professional PDF statements for every month"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Profit Statements</CardTitle>
            <p className="text-sm text-slate-500">
              Monthly profit distribution statements with full transaction details
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolio.statements.map((stmt) => (
                <div
                  key={stmt.id}
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {stmt.month} {stmt.year} Statement
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Opening: {formatCurrency(stmt.openingBalance)}</span>
                        <span>Closing: {formatCurrency(stmt.closingBalance)}</span>
                        <span>Profit: {formatCurrency(stmt.profitEarned)}</span>
                      </div>
                      <Badge variant="teal" className="mt-2">
                        {stmt.annualizedReturn}% p.a. return
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload(stmt.id)}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statement Preview — May 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-8">
              <div className="border-b border-slate-200 pb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div>
                    <p className="text-xl font-bold text-slate-900">AWS Vision</p>
                    <p className="text-xs text-slate-500">Global Investment & Wealth Management</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Monthly Account Statement</p>
                    <p className="text-sm text-slate-500">May 2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: "Opening Balance", value: formatCurrency(128500) },
                  { label: "Profit Earned", value: formatCurrency(1847.25) },
                  { label: "Closing Balance", value: formatCurrency(131200) },
                  { label: "Total Deposits", value: formatCurrency(0) },
                  { label: "Total Withdrawals", value: formatCurrency(0) },
                  { label: "Annualized Return", value: "8.5% p.a." },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="mt-1 font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
