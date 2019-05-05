const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeMail = (name,email) => {
	const msg = {
		to: email,
		from: 'shivamgor498@gmail.com',
		subject: 'Welcome on-board',
		text: `Thanks for joining ${name}. `
	}
	sgMail.send(msg)
}
const sendGoodByeMail = (name,email) => {
	const msg = {
		to: email,
		from: 'shivamgor498@gmail.com',
		subject: 'GoodBye',
		text: `Good Bye ${name}, your account is successfully deleted.`
	}
	sgMail.send(msg)
}
module.exports = {
	sendWelcomeMail,
	sendGoodByeMail
}