export default function passwordResetMail({ name, resetUrl, expiresInMinutes }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Hello ${name || ''},</h2>
      <p>You requested to reset your password.</p>
      <p>Please click the button below to reset it:</p>
      <a href="${resetUrl}" 
         style="display:inline-block; padding:10px 20px; color:white; background:#007bff; text-decoration:none; border-radius:5px;">
         Reset Password
      </a>
      <br/><br/>
      <p>If you didn’t request this, please ignore this email.</p>
      <p><small>This link will expire in ${expiresInMinutes} minutes.</small></p>
    </div>
  `;
}
