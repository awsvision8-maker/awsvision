import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { MonthlyStatement, Transaction, User } from "@/types";
import { formatCurrency, formatDate } from "./utils";

export function generateStatementPDF(
  statement: MonthlyStatement,
  user: User,
  transactions: Transaction[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("AWS Vision", 20, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Global Investment & Wealth Management", 20, 28);
  doc.text("www.awsvision.com", 20, 34);

  doc.setFontSize(14);
  doc.text("Monthly Account Statement", pageWidth - 20, 20, { align: "right" });
  doc.setFontSize(10);
  doc.text(`${statement.month} ${statement.year}`, pageWidth - 20, 28, {
    align: "right",
  });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  let y = 58;

  doc.setFont("helvetica", "bold");
  doc.text("Account Holder", 20, y);
  doc.setFont("helvetica", "normal");
  y += 6;
  doc.text(`${user.firstName} ${user.lastName}`, 20, y);
  y += 5;
  doc.text(user.email, 20, y);
  y += 5;
  doc.text(`Statement Period: ${statement.month} 1 - ${statement.month} 30, ${statement.year}`, 20, y);

  y += 15;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, y, pageWidth - 40, 40, 3, 3, "F");

  const summaryItems = [
    { label: "Opening Balance", value: formatCurrency(statement.openingBalance) },
    { label: "Total Deposits", value: formatCurrency(statement.totalDeposits) },
    { label: "Total Withdrawals", value: formatCurrency(statement.totalWithdrawals) },
    { label: "Profit Earned", value: formatCurrency(statement.profitEarned) },
    { label: "Closing Balance", value: formatCurrency(statement.closingBalance) },
    { label: "Annualized Return", value: `${statement.annualizedReturn}% p.a.` },
  ];

  const colWidth = (pageWidth - 40) / 3;
  summaryItems.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 25 + col * colWidth;
    const sy = y + 10 + row * 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, x, sy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(item.value, x, sy + 6);
  });

  y += 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Transaction Details", 20, y);

  const monthTransactions = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return (
      d.getMonth() === new Date(`${statement.month} 1, ${statement.year}`).getMonth() &&
      d.getFullYear() === statement.year
    );
  });

  autoTable(doc, {
    startY: y + 5,
    head: [["Date", "Description", "Type", "Amount", "Status"]],
    body: monthTransactions.length
      ? monthTransactions.map((tx) => [
          formatDate(tx.date),
          tx.description,
          tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
          formatCurrency(tx.amount),
          tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
        ])
      : [["—", "No transactions this period", "—", "—", "—"]],
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 20, right: 20 },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "This statement is generated electronically and is valid without signature. AWS Vision is a registered investment platform.",
    20,
    finalY,
    { maxWidth: pageWidth - 40 }
  );
  doc.text(`Generated on ${formatDate(new Date())}`, 20, finalY + 10);

  doc.save(`AWSVision_Statement_${statement.month}_${statement.year}.pdf`);
}
