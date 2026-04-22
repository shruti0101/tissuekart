import { connectDB } from "@/lib/Db"
import Order from "@/models/Order"
import PDFDocument from "pdfkit/js/pdfkit.standalone.js"
import mongoose from "mongoose"
import path from "path"
import fs from "fs"

export async function GET(req, { params }) {
  try {
    await connectDB()

    const { id } = params

    let order = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id)
    }

    if (!order) {
      order = await Order.findOne({ orderId: id })
    }

    if (!order) {
      return Response.json({ msg: "Order not found" }, { status: 404 })
    }

    // ===== INIT =====
    const doc = new PDFDocument({ margin: 40 })
    doc.font("Helvetica")

    const chunks = []
    doc.on("data", chunk => chunks.push(chunk))

    const streamPromise = new Promise(resolve => {
      doc.on("end", () => resolve(Buffer.concat(chunks)))
    })

    // ===== LOGO PATH =====
    const logoPath = path.join(process.cwd(), "public/logo.png")

    // ===== HEADER BACKGROUND =====
    doc.rect(0, 0, 600, 110).fill("#fafafa")

    // ===== LOGO =====
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 35, { width: 55 })
    }

    // ===== COMPANY INFO =====
    doc
      .fillColor("#000")
      .fontSize(18)
      .text("Vishal Enterprise", 110, 40)

    doc
      .fontSize(10)
      .fillColor("#555")
      .text("Premium Dates & Dry Fruits", 110, 60)
      .text("Delhi, India", 110, 75)

    // ===== INVOICE TITLE =====
    doc
      .fontSize(20)
      .fillColor("#000")
      .text("INVOICE", 400, 45, { align: "right" })

    // ===== DIVIDER =====
    doc
      .moveTo(40, 110)
      .lineTo(550, 110)
      .stroke("#e5e5e5")

    // ===== ORDER INFO =====
    doc
      .fontSize(11)
      .fillColor("#000")
      .text(`Order ID: ${order.orderId || order._id}`, 40, 130)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 40, 145)

    // ===== CUSTOMER =====
    doc.fontSize(11).text("Bill To:", 40, 180)

    doc
      .fontSize(10)
      .fillColor("#555")
      .text(order.name || "Customer", 40, 195)
      .text(order.email || "-", 40, 210)
      .text(order.phone || "-", 40, 225)

    // ===== TABLE HEADER =====
    const tableTop = 270

    doc
      .fontSize(11)
      .fillColor("#000")
      .text("Product", 40, tableTop)
      .text("Qty", 300, tableTop)
      .text("Price", 350, tableTop)
      .text("Total", 450, tableTop)

    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke()

    // ===== TABLE ROWS =====
    let y = tableTop + 25

    order.products.forEach(item => {
      doc
        .fontSize(10)
        .fillColor("#333")
        .text(item.name, 40, y)
        .text(item.quantity, 300, y)
        .text(`₹${item.price}`, 350, y)
        .text(`₹${item.price * item.quantity}`, 450, y)

      y += 20
    })

    // ===== TOTAL BOX =====
    doc.rect(350, y + 20, 200, 55).fill("#f5f5f5")

    doc
      .fillColor("#000")
      .fontSize(12)
      .text("Total Amount", 360, y + 30)

    doc
      .fontSize(16)
      .fillColor("#000")
      .text(`₹${order.total}`, 360, y + 48)

    // ===== FOOTER =====
    doc
      .fontSize(10)
      .fillColor("#888")
      .text(
        "Thank you for your business!",
        40,
        750,
        { align: "center", width: 500 }
      )

    doc.end()

    const pdfBuffer = await streamPromise

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${order.orderId || order._id}.pdf`
      }
    })

  } catch (err) {
    console.error(err)
    return Response.json({ msg: "Server error" }, { status: 500 })
  }
}