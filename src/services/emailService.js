import { createTransport } from 'nodemailer'
import 'dotenv/config'
import { templateEmailWelcomeUser } from 'root/utils/templateEmails.js'

export const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const configMail = (user) => {
  const context = {
    companyData: {
      name: 'Mega Stock',
      primaryColor: '#432DD7',
      loginUrl: `http://localhost:${process.env.PORT}/api/user`,
      address: 'Carrera 56 #14-12, Bogota D.C',
      phone: '+57 312312453',
      website: `http://localhost:${process.env.PORT}/`
    },
    user: { ...user }
  }

  const template = templateEmailWelcomeUser(context)

  const mailConfig = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: 'Bienvenido/a a Mega Stock',
    html: template
  }

  return mailConfig
}
