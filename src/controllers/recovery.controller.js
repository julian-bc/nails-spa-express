import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import config from "../config/config.js";
import { sendEmail } from "../utils/sender.util.js";

export const recoveryPass = async(req, res) => {
  const { email } = req.body;

  try {
    const userSaved = await User.findOne({ email });

    if (!userSaved) return res.status(404).send({ error: `No se encontró ningún usuario con ese correo electrónico: ${email}` });

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    userSaved.recoveryCode = recoveryCode;
    await userSaved.save();

    await sendEmail({
      to: email,
      subject: "RecoveryCode - Reset Your Password",
      text: `Aquí está su código de recuperación para restablecer su contraseña: : ${recoveryCode}\n\nSi no solicitó esto, por favor ignore este mensaje.`
    });
    res.status(200).send({ message: "Código de recuperación generado con éxito" });
  } catch (err) {
    return res.status(500).send({ 
      error: "Ocurrió un error al generar el código de recuperación",
      ...(config.nodeEnv !== "production" && { stack: err.stack })
    });
  }
}

export const setPass = async (req, res) => {
  const { email, newPass, recoveryCode } = req.body;

  try {
    const userSaved = await User.findOne({ email });

    if (!userSaved) return res.status(404).send({ error: `No se encontró ningún usuario con ese correo electrónico: ${email}` });

    if (userSaved.recoveryCode !== recoveryCode) return res.status(401).send({ error: "Código de recuperación inválido" });

    const passwordHashed = await bcrypt.hash(newPass, 10);
    userSaved.password = passwordHashed;
    userSaved.recoveryCode = null;

    await userSaved.save();

    res.status(200).send({ message: "Contraseña actualizada con éxito" });
  } catch (err) {
    return res.status(500).send({ 
      error: "Ocurrió un error al actualizar la contraseña",
      ...(config.nodeEnv !== "production" && { stack: err.stack })
    });
  }
}