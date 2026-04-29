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

    const tissueToken = 10;

    // 🧾 Product Table
    const productRows = products
      .map(
        (item) => `
        <tr>
          <td>${item.name || "Product"}</td>
          <td>${item.quantity || 1}</td>
          <td>₹${item.price || 0}</td>
        </tr>
      `
      )
      .join("");

    const productTable = `
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width:100%;">
        <tr>
          <th align="left">Product</th>
          <th align="left">Qty</th>
          <th align="left">Price</th>
        </tr>
        ${productRows}
      </table>
    `;

    // 📧 Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✉️ HTML
    const html = `
      <div style="font-family: Arial; padding:20px; color:#333;">
        
        <h2>🛒 Order Confirmation</h2>
        <p>Thank you for your order, <strong>${name || "Customer"}</strong>!</p>

        <h3>📦 Order Summary</h3>
        ${productTable}

        <br/>

        <h3>🎁 Discounts Applied</h3>
        <p><strong>Tissue Token:</strong> -₹${tissueToken}</p>

        <h3>💰 Final Amount</h3>
        <p><strong>Total Payable:</strong> ₹${total || 0}</p>

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
          <strong>Date:</strong> ${
            createdAt
              ? new Date(createdAt).toLocaleString()
              : new Date().toLocaleString()
          }
        </p>

        <br/>

        <p>We will notify you once your order is shipped.</p>

        <p>Regards,<br/><strong>Tissue Kart Team</strong></p>
      </div>
    `;

    // 🚀 SEND
    await transporter.sendMail({
      from: `"Tissue Kart" <${process.env.EMAIL_USER}>`,
      to: to,
      cc: "matrixtissues@gmail.com",
      subject: `Order Confirmation #${orderId} - Tissue Kart`,
      html,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email Error:", err.message);
  }
};




