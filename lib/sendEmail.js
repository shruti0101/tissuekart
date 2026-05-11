import nodemailer from "nodemailer";

export const sendOrderEmail = async ({ to, order }) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      pincode,
      products = [],
      total,
      paymentMethod,
      paymentId,
      orderId,
      createdAt,
    } = order;

    // ================= PRODUCTS TABLE =================
    const productRows = products
      .map(
        (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">
            ${item.name || "Product"}
          </td>

          <td style="padding:8px;border:1px solid #ddd;">
            ${item.quantity || 1}
          </td>

          <td style="padding:8px;border:1px solid #ddd;">
            ₹${item.price || 0}
          </td>
        </tr>
      `
      )
      .join("");

    const productTable = `
      <table style="width:100%;border-collapse:collapse;margin-top:10px;">
        <tr style="background:#f5f5f5;">
          <th style="padding:10px;border:1px solid #ddd;text-align:left;">
            Product
          </th>

          <th style="padding:10px;border:1px solid #ddd;text-align:left;">
            Qty
          </th>

          <th style="padding:10px;border:1px solid #ddd;text-align:left;">
            Price
          </th>
        </tr>

        ${productRows}
      </table>
    `;

    // ================= EMAIL HTML =================
    const html = `
      <div style="font-family:Arial;padding:20px;color:#333;">

        <h2>🛒 Order Confirmation</h2>

        <p>
          Thank you for your order,
          <strong>${name || "Customer"}</strong>!
        </p>

        <h3>📦 Order Summary</h3>

        ${productTable}

        <br/>

        <h3>💰 Final Amount</h3>

        <p>
          <strong>Total Payable:</strong> ₹${total || 0}
        </p>

        <h3>📞 Contact Details</h3>

        <p>
          <strong>Name:</strong> ${name || "N/A"}<br/>
          <strong>Email:</strong> ${email || "N/A"}<br/>
          <strong>Phone:</strong> ${phone || "N/A"}
        </p>

        <h3>📍 Shipping Address</h3>

        <p>
          ${address || "N/A"}<br/>
          Pincode: ${pincode || "N/A"}
        </p>

        <h3>💳 Payment Details</h3>

        <p>
          <strong>Method:</strong> ${paymentMethod || "N/A"}<br/>
          <strong>Payment ID:</strong> ${paymentId || "N/A"}
        </p>

        <h3>🧾 Order Info</h3>

        <p>
          <strong>Order ID:</strong> ${orderId}<br/>

          <strong>Date:</strong>
          ${
            createdAt
              ? new Date(createdAt).toLocaleString()
              : new Date().toLocaleString()
          }
        </p>

        <br/>

        <p>
          We will notify you once your order is shipped.
        </p>

        <p>
          Regards,<br/>
          <strong>Tissue Kart Team</strong>
        </p>

      </div>
    `;

    // ================= GMAIL SMTP =================
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ================= VERIFY SMTP =================
    await transporter.verify();

    console.log("✅ SMTP Connected");

    // ================= SEND MAIL =================
    const info = await transporter.sendMail({
      from: `"Tissue Kart" <${process.env.EMAIL_USER}>`,

      to,

      cc: [
        "matrixtissues@gmail.com",
        "inquiry.promozione@gmail.com",
      ],

      subject: `Order Confirmation #${orderId} - Tissue Kart`,

      html,
    });

    console.log("✅ Email Sent:", info.messageId);

    return true;

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);

    return false;
  }
};