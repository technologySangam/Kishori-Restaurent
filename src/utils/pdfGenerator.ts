import { jsPDF } from "jspdf";
import { Order } from "../types";

export function downloadInvoicePDF(order: Order) {
  // Initialize standard A4 portrait PDF document (210mm x 297mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Base configurations
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 15;

  // Kishori Brand Colors
  const primaryColor = [15, 76, 92]; // #0F4C5C Deep Teal
  const accentColor = [233, 196, 106]; // #E9C46A Soft Gold
  const textColorPrimary = [26, 26, 26]; // #1A1A1A Charcoal
  const textColorSecondary = [102, 102, 102]; // #666666 Muted Gray
  const lightBgColor = [250, 249, 246]; // #FAF9F6 Cream Off-White
  const borderCol = [220, 220, 220];

  // 1. HEADER BANNER (#0F4C5C)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 42, "F");

  // Accent Gold Line below header
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 42, pageWidth, 3, "F");

  // Header Text Left (Company branding)
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("KISHORI RESTAURANT", marginX, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("100% Pure Vegetarian Family Restaurant", marginX, 23);
  doc.text("Bela, Pratapgarh, Uttar Pradesh - 230001", marginX, 28);
  doc.text("Customer Support Helpline: +91 08052777728", marginX, 33);

  // Header Text Right (Invoice metadata)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("TAX INVOICE", pageWidth - marginX, 16, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("OFFICIAL SELLER RECEIPT", pageWidth - marginX, 22, { align: "right" });

  // Order ID Badge in Gold Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  (doc as any).setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`Order ID: #${order.id}`, pageWidth - marginX, 32, { align: "right" });


  // 2. BILLING & ORDER DETAILS SECTION
  let y = 56;

  // Labels
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("CUSTOMER REGISTERED INFO", marginX, y);
  doc.text("ORDER METADATA", 110, y);

  // Accent sub-lines
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.setLineWidth(0.3);
  doc.line(marginX, y + 2, 95, y + 2);
  doc.line(110, y + 2, pageWidth - marginX, y + 2);

  y += 8;

  // Real data
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
  doc.text(order.customerName, marginX, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);
  doc.text(`Phone: ${order.customerPhone}`, marginX, y + 6);
  doc.text(`Email: ${order.customerEmail}`, marginX, y + 12);

  // Right side - metadata
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`Date & Time: ${new Date(order.createdAt).toLocaleString()}`, 110, y);
  doc.text(`Payment Instrument: ${order.paymentMethod}`, 110, y + 6);

  // Draw Status Badge-like text
  doc.text("Delivery Status: ", 110, y + 12);
  const statusStr = order.status.toUpperCase();
  doc.setFont("helvetica", "bold");
  if (order.status === "Delivered" || order.status === "Accepted") {
    doc.setTextColor(21, 128, 61); // emerald-700
  } else if (order.status === "Rejected") {
    doc.setTextColor(220, 38, 38); // red-600
  } else {
    doc.setTextColor(180, 83, 9); // amber-700
  }
  doc.text(statusStr, 137, y + 12);

  // Reset text color
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);

  y += 20;

  // 3. DELIVERY ADDRESS BLOCK
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DELIVERY DESTINATION ADDRESS", marginX, y);
  doc.line(marginX, y + 2, pageWidth - marginX, y + 2);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);

  // Wrap long text to fit inside 180mm width
  const splitAddress = doc.splitTextToSize(order.deliveryAddress, pageWidth - marginX * 2);
  doc.text(splitAddress, marginX, y);

  // Adjust Y based on split address length
  y += splitAddress.length * 5 + 4;


  // 4. ITEMS GRID TABLE
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(marginX, y, pageWidth - marginX * 2, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Menu Item Name", marginX + 3, y + 5.5);
  doc.text("Category", 110, y + 5.5);
  doc.text("Rate", 145, y + 5.5, { align: "right" });
  doc.text("Qty", 165, y + 5.5, { align: "right" });
  doc.text("Net Total", pageWidth - marginX - 3, y + 5.5, { align: "right" });

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  order.items.forEach((item, index) => {
    // Alternating rows zebra pattern styling
    if (index % 2 === 1) {
      doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
      doc.rect(marginX, y, pageWidth - marginX * 2, 8, "F");
    }

    doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(item.name, marginX + 3, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);
    doc.text(item.category || "North Indian", 110, y + 5.5);

    doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
    doc.text(`INR ${item.price.toFixed(2)}`, 145, y + 5.5, { align: "right" });
    doc.text(`${item.quantity}`, 165, y + 5.5, { align: "right" });
    doc.text(`INR ${(item.price * item.quantity).toFixed(2)}`, pageWidth - marginX - 3, y + 5.5, { align: "right" });

    y += 8;
  });

  // Solid bottom grid border line
  doc.setDrawColor(borderCol[0], borderCol[1], borderCol[2]);
  doc.line(marginX, y, pageWidth - marginX, y);

  y += 6;


  // 5. CALCULATION TOTALS BLOCK
  const totalsStartX = 115;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);

  doc.text("Subtotal Component:", totalsStartX, y);
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
  doc.text(`INR ${order.subtotal.toFixed(2)}`, pageWidth - marginX - 3, y, { align: "right" });

  y += 6;
  doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);
  doc.text("GST Tax (5% Unified):", totalsStartX, y);
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
  doc.text(`INR ${order.tax.toFixed(2)}`, pageWidth - marginX - 3, y, { align: "right" });

  y += 6;
  doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);
  doc.text("Delivery Logistics Surcharge:", totalsStartX, y);
  doc.setTextColor(textColorPrimary[0], textColorPrimary[1], textColorPrimary[2]);
  doc.text(order.deliveryCharge === 0 ? "FREE OF CHARGE" : `INR ${order.deliveryCharge.toFixed(2)}`, pageWidth - marginX - 3, y, { align: "right" });

  if (order.discount > 0) {
    y += 6;
    doc.setTextColor(21, 128, 61); // forest green color
    doc.setFont("helvetica", "bold");
    doc.text(`Promo Savings (${order.couponCode || "COUPON"}):`, totalsStartX, y);
    doc.text(`-INR ${order.discount.toFixed(2)}`, pageWidth - marginX - 3, y, { align: "right" });
    // Reset font
    doc.setFont("helvetica", "normal");
  }

  y += 6;

  // Solid double-lines or bar for grand total
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(totalsStartX, y, pageWidth - marginX - totalsStartX, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Grand Invoice Total:", totalsStartX + 3, y + 5.5);
  // Highlight price with soft gold text
  (doc as any).setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text(`INR ${order.total.toFixed(2)}`, pageWidth - marginX - 3, y + 5.5, { align: "right" });


  // 6. OFFICIAL SYSTEM FOOTER (Sticky near bottom)
  y = pageHeight - 38;

  // Certified Vegetarian graphical box
  doc.setDrawColor(21, 128, 61); // green
  doc.setLineWidth(0.5);
  doc.rect(marginX, y, 7, 7, "S");
  doc.setFillColor(21, 128, 61);
  doc.circle(marginX + 3.5, y + 3.5, 1.8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text("CERTIFIED 100% PURE VEGETARIAN CULINARY EXPERIENCE", marginX + 10, y + 5);

  y += 12;

  // Centered footer guidelines
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(textColorSecondary[0], textColorSecondary[1], textColorSecondary[2]);
  doc.text("This receipt is a computer-generated tax document. No signature is legally required.", pageWidth / 2, y, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Thank you for your highly valued patronage with Kishori. Come visit us again!", pageWidth / 2, y + 5, { align: "center" });

  // Save/Download operation
  doc.save(`Kishori_Tax_Invoice_${order.id}.pdf`);
}
