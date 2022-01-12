const nodemailer = require("nodemailer");
import dotenv from "dotenv";
import shopInfor from "../constants/shopInfor";
dotenv.config({ path: "./.env" });

export const sendEmail = async (payload: any) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL, // generated ethereal user
      pass: process.env.AUTH_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${shopInfor} Website <shoplocvung@gmail.com>`, // sender address
    //to: "receiverEmail", // list of receivers
    to: [`${process.env.RECV_EMAIL_SALE}`, `${process.env.RECV_EMAIL_BOSS}`],
    subject: `${shopInfor.name} website have new email`, // Subject line
    html: `
    <h2><b>Inquiry Information</b></h2>
    <div style="margin-left: 30px;">
    <p><b>Cutosmer Name:</b> ${payload.customerName} <p>
    <p><b>Cutosmer Email:</b> ${payload.customerEmail} <p>
    <p><b>Cutosmer Phone</b>: ${payload.customerPhone} <p>
    <p><b>Message:</b> ${payload.message} <p>
    </div>
    <div>
    <p> ${shopInfor.name} - High quality products <a href="aaaa">Click Here</a></p>
    </div>
    `, // html body
  });
};
