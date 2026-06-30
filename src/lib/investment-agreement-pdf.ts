import jsPDF from "jspdf";
import type { InvestmentAgreement } from "@/types";
import { formatCurrency, formatDate } from "./utils";

const TEAL: [number, number, number] = [13, 148, 136];
const SLATE: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];

async function loadImageDataUrl(path: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function loadKeyedImageDataUrl(path: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 40 && g < 40 && b < 40) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  } catch {
    return loadImageDataUrl(path);
  }
}

async function loadLogoDataUrl() {
  return loadImageDataUrl("/logo.png");
}

/** Official AWS Vision seal — black keyed to transparent for white PDF pages. */
async function loadOfficialStampDataUrl(): Promise<string | null> {
  return loadKeyedImageDataUrl("/official-stamp.png");
}

/** Nick — Relationship Manager authorized signature. */
async function loadNickSignatureDataUrl(): Promise<string | null> {
  return loadKeyedImageDataUrl("/nick-signature.png");
}

function drawWatermark(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setTextColor(226, 232, 240);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(52);
  for (let y = 40; y < h; y += 70) {
    for (let x = -20; x < w; x += 90) {
      doc.text("AWS VISION", x, y, { angle: 35 });
    }
  }
}

/** Official AWS Vision stamp image (AWS VISION · SINCE 2017). */
function drawOfficialStamp(doc: jsPDF, cx: number, cy: number, stampDataUrl: string | null, size = 46) {
  if (stampDataUrl) {
    doc.addImage(stampDataUrl, "PNG", cx - size / 2, cy - size / 2, size, size);
  }
}

function drawAuthorizedSignatoryBlock(
  doc: jsPDF,
  authX: number,
  lineY: number,
  lineEndX: number,
  signatureDataUrl: string | null,
  stampDataUrl: string | null
) {
  const sigWidth = 48;
  const sigHeight = 20;

  if (signatureDataUrl) {
    doc.addImage(signatureDataUrl, "PNG", authX, lineY - sigHeight - 2, sigWidth, sigHeight);
  }

  drawOfficialStamp(doc, lineEndX - 22, lineY - 10, stampDataUrl, 40);

  doc.setDrawColor(203, 213, 225);
  doc.line(authX, lineY, lineEndX, lineY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("AWS Vision — Authorized Signatory", authX, lineY + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  doc.text("Nick", authX, lineY + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Relationship Manager & Authorized Person", authX, lineY + 17);
  doc.text("AWS Vision Financial Services", authX, lineY + 22);
}

function wrapText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line, i) => doc.text(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function sectionTitle(doc: jsPDF, title: string, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...SLATE);
  doc.text(title, 20, y);
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.4);
  doc.line(20, y + 2, 190, y + 2);
  return y + 10;
}

export async function generateInvestmentAgreementPDF(agreement: InvestmentAgreement) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  drawWatermark(doc);

  doc.setFillColor(...SLATE);
  doc.rect(0, 0, pageWidth, 48, "F");

  const logo = await loadLogoDataUrl();
  const stamp = await loadOfficialStampDataUrl();
  const nickSignature = await loadNickSignatureDataUrl();
  if (logo) {
    doc.addImage(logo, "PNG", margin, 8, 22, 22);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AWS Vision", logo ? margin + 26 : margin, 18);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Global Investment & Wealth Management", logo ? margin + 26 : margin, 25);
  doc.text("www.awsvision.com  ·  compliance@awsvision.com", logo ? margin + 26 : margin, 31);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("INVESTMENT PROGRAM ENROLLMENT", pageWidth - margin, 16, { align: "right" });
  doc.text("& CONFIDENTIALITY AGREEMENT", pageWidth - margin, 23, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Agreement No. ${agreement.agreementNumber}`, pageWidth - margin, 32, { align: "right" });
  doc.text(`Issued ${formatDate(agreement.issuedAt)}`, pageWidth - margin, 38, { align: "right" });
  if (agreement.amendedAt) {
    doc.setTextColor(251, 191, 36);
    doc.text(`Amended ${formatDate(agreement.amendedAt)}`, pageWidth - margin, 44, { align: "right" });
    doc.setTextColor(255, 255, 255);
  }

  let y = 58;
  doc.setTextColor(...SLATE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  y = wrapText(
    doc,
    "This Investment Program Enrollment Agreement and Non-Disclosure Acknowledgment (\"Agreement\") confirms the opening and funding of your AWS Vision account, enrollment in the selected investment program tier, and your acceptance of confidentiality obligations regarding proprietary program information.",
    margin,
    y,
    contentWidth
  );

  y += 6;
  y = sectionTitle(doc, "1. Account Holder Information", y);

  const clientName = `${agreement.clientFirstName} ${agreement.clientLastName}`;
  const infoRows: [string, string][] = [
    ["Account Holder", clientName],
    ["Email Address", agreement.clientEmail],
    ["Account Number", agreement.accountNumber],
    ["Account Type", agreement.accountType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())],
    ["Agreement Reference", agreement.agreementNumber],
  ];

  doc.setFontSize(9);
  infoRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SLATE);
    doc.text(value, margin + 52, y);
    y += 6;
  });

  y += 4;
  y = sectionTitle(doc, "2. Program Enrollment & Deposit Confirmation", y);

  doc.setFillColor(240, 253, 250);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "F");
  doc.setDrawColor(...TEAL);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "S");

  const boxY = y + 8;
  const col = contentWidth / 3;
  const highlights: [string, string][] = [
    ["Program Tier", agreement.planName],
    ["Approved Deposit", formatCurrency(agreement.depositAmount)],
    ["Total Capital", formatCurrency(agreement.totalPrincipal)],
    ["Monthly Profit Rate", `${agreement.monthlyRatePercent}% on capital`],
    ["Program Tenure", `${agreement.termMonths} months`],
    ["Maturity Date", formatDate(agreement.maturityDate)],
    ["Total Program Return", `${agreement.totalRoiPercent}% (${agreement.termMonths} mo)`],
    ["Est. Monthly Profit", formatCurrency((agreement.totalPrincipal * agreement.monthlyRatePercent) / 100)],
    ["Profit Eligibility", "30 days after deposit approval"],
  ];

  highlights.forEach(([label, value], i) => {
    const cx = margin + 6 + (i % 3) * col;
    const cy = boxY + Math.floor(i / 3) * 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(label, cx, cy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text(value, cx, cy + 4);
  });

  y += 46;

  if (agreement.amendedAt || agreement.amendmentNote) {
    doc.setFillColor(255, 251, 235);
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.3);
    const amendHeight = agreement.amendmentNote ? 22 : 14;
    doc.roundedRect(margin, y, contentWidth, amendHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.text("Program Amendment — Special Offer Terms", margin + 4, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 53, 15);
    if (agreement.amendmentNote) {
      wrapText(
        doc,
        agreement.amendmentNote,
        margin + 4,
        y + 13,
        contentWidth - 8,
        4
      );
    } else {
      doc.text(
        `Terms updated ${formatDate(agreement.amendedAt!)} — current rates and tenure reflected below supersede the original issuance.`,
        margin + 4,
        y + 13,
        { maxWidth: contentWidth - 8 }
      );
    }
    y += amendHeight + 6;
  }

  y = sectionTitle(doc, "3. Terms of Enrollment", y);

  const terms = [
    `Capital Tier Assignment: Based on your approved deposit of ${formatCurrency(agreement.depositAmount)} and total enrolled capital of ${formatCurrency(agreement.totalPrincipal)}, your account is enrolled in the ${agreement.planName} program at ${agreement.monthlyRatePercent}% monthly profit on capital for a ${agreement.termMonths}-month program term ending ${formatDate(agreement.maturityDate)}.`,
    `Monthly Profit Distribution: Program profit is calculated on enrolled capital at the stated monthly rate and credited to your account each calendar month, subject to the 30-day profit eligibility period from deposit approval.`,
    `Capital Commitment: Enrolled capital remains allocated to the ${agreement.planName} structured portfolio for the full program tenure unless early withdrawal terms apply per your program schedule.`,
    `Program Return: Total modeled program return is ${agreement.totalRoiPercent}% over ${agreement.termMonths} months (${agreement.planName} tier), inclusive of monthly profit distributions and capital appreciation per published program terms at awsvision.com/rates.`,
    `Account Opening: This document serves as official confirmation that AWS Vision has received, verified, and approved your deposit and activated your investment account under the selected program tier.`,
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  terms.forEach((t, i) => {
    y = wrapText(doc, `${i + 1}. ${t}`, margin, y, contentWidth, 4.5);
    y += 3;
  });

  if (y > pageHeight - 90) {
    doc.addPage();
    drawWatermark(doc);
    y = 25;
  }

  y += 2;
  y = sectionTitle(doc, "4. Confidentiality & Non-Disclosure (NDA)", y);

  const ndaClauses = [
    "The Client acknowledges that AWS Vision program structures, portfolio allocations, rate schedules, internal compliance procedures, and account management systems constitute confidential and proprietary information.",
    "The Client agrees not to disclose, reproduce, or distribute any non-public program materials, account credentials, internal correspondence, or investment methodology shared by AWS Vision to any third party without prior written consent.",
    "This obligation survives account opening and remains in effect for the duration of the program tenure and for a period of two (2) years thereafter.",
    "Authorized disclosures to legal, tax, or financial advisors bound by professional confidentiality are permitted solely for the Client's personal financial planning purposes.",
    "Breach of confidentiality may result in suspension of portal access and termination of program enrollment, subject to applicable law and program terms.",
  ];

  ndaClauses.forEach((clause, i) => {
    y = wrapText(doc, `${String.fromCharCode(97 + i)}. ${clause}`, margin, y, contentWidth, 4.5);
    y += 2;
  });

  if (y > pageHeight - 55) {
    doc.addPage();
    drawWatermark(doc);
    y = 25;
  }

  y += 4;
  y = sectionTitle(doc, "5. Client Acknowledgment", y);

  y = wrapText(
    doc,
    `By accepting this Agreement, ${clientName} confirms that all information provided during Know Your Customer (KYC) verification is accurate, that the deposit funds are from lawful sources, and that they have read and agree to the ${agreement.planName} program terms, monthly profit structure, program tenure, and confidentiality obligations set forth herein.`,
    margin,
    y,
    contentWidth,
    4.5
  );

  y += 8;
  const authX = margin + 95;
  const lineY = y + 18;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, lineY, margin + 70, lineY);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Client (Electronic Acceptance)", margin, lineY + 5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...SLATE);
  doc.text(clientName, margin, lineY + 11);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Digitally issued ${formatDate(agreement.issuedAt)}`, margin, lineY + 16);

  drawAuthorizedSignatoryBlock(doc, authX, lineY, pageWidth - margin, nickSignature, stamp);

  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "This is a computer-generated document. AWS Vision Investment Program Enrollment Agreement is valid when issued through the verified client portal with authorized manager signature. For inquiries contact compliance@awsvision.com.",
    margin,
    pageHeight - 18,
    { maxWidth: contentWidth }
  );

  const safeName = agreement.agreementNumber.replace(/[^a-zA-Z0-9-]/g, "");
  doc.save(`AWSVision_Agreement_${safeName}.pdf`);
}
