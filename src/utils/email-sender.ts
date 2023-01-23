import nodemailer from "nodemailer"
import dotenv from "dotenv"
import findconfig from "find-config"

dotenv.config({ path: findconfig(".env")! })

const sendEmail = async (recipientEmail: string, subject: string, text: string, html: string) => {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.MAIL_EMAIL,
			pass: process.env.MAIL_PASSWORD,
		},
	})

	let mailOptions = {
		from: `AniFind`,
		to: recipientEmail,
		subject,
		text,
		html,
	}
	return await transporter.sendMail(mailOptions)
}
export default sendEmail
