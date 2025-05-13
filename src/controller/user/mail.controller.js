import { transporter, configMail } from 'root/services/emailService.js'

export class MailController {
  constructor (userToMail) {
    this.mailService = transporter
    this.mailConfig = configMail(userToMail)
  }

  async sendEmail (req, res, next) {
    try {
      await this.mailService.sendMail(this.mailConfig)
    } catch (error) {
      next(error)
    }
  }
}
