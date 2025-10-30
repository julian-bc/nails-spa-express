import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nailsSpaUsco@gmail.com",
    pass: config.googleAppPass
  }
});

export const sendEmail = async({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: '"NailsSpa" <nailsSpaUsco@gmail.com>',
      to,
      subject,
      text,
    });
  } catch (err) {
    if (config.nodeEnv !== "production") {
      console.error(`Error al enviar el correo electrónico a ${to}\n\tstack: ${err.stack}`);
    }
  }
};