import jsPDF from "jspdf"

import type { BookingRequest, TravelerDetail } from "src/lib/data/booking-requests"
import type { TravelPackage } from "src/lib/data/packages"
import { formatDateDDMMYYYY } from "src/lib/utils"

const MARGIN_X = 48
const MARGIN_TOP = 56
const MARGIN_BOTTOM = 56

interface ItineraryDayPdf {
  day: number
  title: string
  description: string
}

/**
 * Everything needed to render the trip dossier. This is a hotel/vendor-facing
 * document, not an internal record — deliberately excludes the request ID and
 * lead status (see downloadTripRequestPdf callers). Package-derived fields
 * (location/duration/inclusions/exclusions/itinerary) are resolved from the
 * live package client-side, so they reflect the current confirmed plan.
 */
interface TripRequestPdfData {
  packageTitle: string
  packageLocation: string
  packageDuration: string
  packagePrice: number
  startDate: string
  travelers: number
  travelerDetails: TravelerDetail[]
  fullName: string
  email: string
  phone: string
  specialRequests: string
  inclusions: string[]
  exclusions: string[]
  itinerary: ItineraryDayPdf[]
  /** Used only to build a stable filename — never printed on the page. */
  fileId: string
}

/** Adds a page and resets to the top margin if `needed` points don't fit before the bottom margin. */
function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + needed > pageHeight - MARGIN_BOTTOM) {
    doc.addPage()
    return MARGIN_TOP
  }
  return y
}

function sectionHeading(doc: jsPDF, y: number, pageWidth: number, text: string): number {
  y = ensureSpace(doc, y, 32)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.text(text, MARGIN_X, y)
  y += 6
  doc.setDrawColor(210)
  doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y)
  return y + 18
}

function labeledRow(doc: jsPDF, y: number, contentWidth: number, label: string, value: string): number {
  const labelWidth = 150
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  const wrapped = doc.splitTextToSize(value || "-", contentWidth - labelWidth)
  y = ensureSpace(doc, y, 16 * Math.max(1, wrapped.length))
  doc.text(`${label}:`, MARGIN_X, y)
  doc.setFont("helvetica", "normal")
  doc.text(wrapped, MARGIN_X + labelWidth, y)
  return y + 16 * Math.max(1, wrapped.length) + 4
}

function travelerList(doc: jsPDF, y: number, travelers: TravelerDetail[]): number {
  doc.setFontSize(10.5)
  if (travelers.length === 0) {
    y = ensureSpace(doc, y, 16)
    doc.setFont("helvetica", "italic")
    doc.text("Traveler names to be confirmed.", MARGIN_X, y)
    return y + 18
  }
  travelers.forEach((t, i) => {
    y = ensureSpace(doc, y, 16)
    doc.setFont("helvetica", "normal")
    doc.text(`${i + 1}. ${t.name}${t.age ? ` (Age ${t.age})` : ""}`, MARGIN_X, y)
    y += 16
  })
  return y + 4
}

function bulletList(doc: jsPDF, y: number, contentWidth: number, items: string[]): number {
  doc.setFontSize(10.5)
  for (const item of items) {
    const wrapped = doc.splitTextToSize(`- ${item}`, contentWidth)
    y = ensureSpace(doc, y, 15 * Math.max(1, wrapped.length))
    doc.setFont("helvetica", "normal")
    doc.text(wrapped, MARGIN_X, y)
    y += 15 * Math.max(1, wrapped.length)
  }
  return y + 4
}

function itineraryBlock(doc: jsPDF, y: number, contentWidth: number, days: ItineraryDayPdf[]): number {
  for (const day of days) {
    y = ensureSpace(doc, y, 18)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text(`Day ${day.day}: ${day.title}`, MARGIN_X, y)
    y += 15
    if (day.description) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10.5)
      const wrapped = doc.splitTextToSize(day.description, contentWidth)
      y = ensureSpace(doc, y, 14 * Math.max(1, wrapped.length))
      doc.text(wrapped, MARGIN_X, y)
      y += 14 * Math.max(1, wrapped.length)
    }
    y += 8
  }
  return y
}

/** Generate and trigger a browser download of a trip dossier — meant to be forwarded to hotels/vendors. */
export function downloadTripRequestPdf(data: TripRequestPdfData): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - MARGIN_X * 2
  let y = MARGIN_TOP

  doc.setFont("helvetica", "bold")
  doc.setFontSize(17)
  doc.text("Vrajatian - Trip Itinerary & Guest Details", MARGIN_X, y)
  y += 10
  doc.setDrawColor(180)
  doc.line(MARGIN_X, y, pageWidth - MARGIN_X, y)
  y += 26

  y = sectionHeading(doc, y, pageWidth, "Package Overview")
  y = labeledRow(doc, y, contentWidth, "Package", data.packageTitle)
  y = labeledRow(doc, y, contentWidth, "Location", data.packageLocation)
  y = labeledRow(doc, y, contentWidth, "Duration", data.packageDuration)
  y = labeledRow(doc, y, contentWidth, "Price / person", `Rs. ${data.packagePrice.toLocaleString("en-IN")}`)
  y = labeledRow(doc, y, contentWidth, "Departure date", formatDateDDMMYYYY(data.startDate))
  y = labeledRow(doc, y, contentWidth, "Total travellers", String(data.travelers))
  y += 4

  y = sectionHeading(doc, y, pageWidth, "Traveler Details")
  y = travelerList(doc, y, data.travelerDetails)

  y = sectionHeading(doc, y, pageWidth, "Booking Contact")
  y = labeledRow(doc, y, contentWidth, "Name", data.fullName)
  y = labeledRow(doc, y, contentWidth, "Email", data.email)
  y = labeledRow(doc, y, contentWidth, "Phone", data.phone)
  y += 4

  if (data.inclusions.length > 0) {
    y = sectionHeading(doc, y, pageWidth, "Inclusions")
    y = bulletList(doc, y, contentWidth, data.inclusions)
  }

  if (data.exclusions.length > 0) {
    y = sectionHeading(doc, y, pageWidth, "Exclusions")
    y = bulletList(doc, y, contentWidth, data.exclusions)
  }

  if (data.itinerary.length > 0) {
    y = sectionHeading(doc, y, pageWidth, "Itinerary")
    y = itineraryBlock(doc, y, contentWidth, data.itinerary)
  }

  if (data.specialRequests) {
    y = sectionHeading(doc, y, pageWidth, "Special Requests / Notes")
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10.5)
    const wrapped = doc.splitTextToSize(data.specialRequests, contentWidth)
    y = ensureSpace(doc, y, 14 * Math.max(1, wrapped.length))
    doc.text(wrapped, MARGIN_X, y)
  }

  const safeName = data.fullName.trim().replace(/\s+/g, "-").toLowerCase() || "trip"
  doc.save(`trip-itinerary-${safeName}-${data.fileId.slice(0, 8)}.pdf`)
}

/** Build PDF data for the live, current state of a trip request. `pkg` is the linked package, looked up client-side (may be undefined if it was later deleted). */
export function tripRequestToPdfData(req: BookingRequest, pkg?: TravelPackage): TripRequestPdfData {
  return {
    packageTitle: req.packageTitle,
    packageLocation: pkg?.location ?? "-",
    packageDuration: pkg?.duration ?? "-",
    packagePrice: req.packagePrice,
    startDate: req.startDate,
    travelers: req.travelers,
    travelerDetails: req.travelerDetails,
    fullName: req.fullName,
    email: req.email,
    phone: req.phone,
    specialRequests: req.specialRequests,
    inclusions: pkg?.inclusions ?? [],
    exclusions: pkg?.exclusions ?? [],
    itinerary: pkg?.itinerary ?? [],
    fileId: req.id,
  }
}
