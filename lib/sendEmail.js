import nodemailer from "nodemailer";

export const sendOrderEmail = async ({ to, order }) => {
  const {
    name,
    email,
    phone,
    address,
    pincode,
    products,
    total,
    paymentMethod,
    paymentId,
    orderId,
    createdAt,
  } = order;

  const tissueToken = 10;

  // 🧾 Product Table (like PHP)
  const productRows = products
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price}</td>
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

  // 📧 Mail Transport
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  // ✉️ Email HTML (MATCHING YOUR PHP)
  const html = `
    <div style="font-family: Arial; padding:20px; color:#333;">
      
      <h2>🛒 Order Confirmation</h2>
      <p>Thank you for your order, <strong>${name}</strong>!</p>

      <h3>📦 Order Summary</h3>
      ${productTable}

      <br/>

      <h3>🎁 Discounts Applied</h3>
      <p>
        <strong>Tissue Token:</strong> -₹${tissueToken}
      </p>

      <h3>💰 Final Amount</h3>
      <p><strong>Total Payable:</strong> ₹${total}</p>

      <h3>📞 Contact Details</h3>
      <p>
        <strong>Phone:</strong> ${phone}
      </p>

      <h3>💳 Payment Details</h3>
      <p>
        <strong>Method:</strong> ${paymentMethod}<br/>
        <strong>Payment ID:</strong> ${paymentId || "N/A"}
      </p>

      <h3>📍 Shipping Address</h3>
      <p>
        ${address}<br/>
        Pincode: ${pincode}
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

  // 🚀 Send Mail
  await transporter.sendMail({
    from: `"Tissue Kart" <${process.env.EMAIL_USER}>`,
    to,
    cc: "matrixtissues@gmail.com", // ✅ Admin copy like PHP
    subject: `Order Confirmation #${orderId} - Tissue Kart`,
    html,
  });
};