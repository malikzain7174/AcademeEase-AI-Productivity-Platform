'use server';

/**
 * Generate HTML for verification email
 */
export async function getVerificationEmailHTML(
  name: string,
  code: string
): Promise<string> {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your AcademEase account</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 5px;
          text-align: center;
          margin: 30px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AcademEase</h1>
        </div>
        <p>Hello ${name},</p>
        <p>Thank you for signing up for AcademEase. To verify your email address, please use the following verification code:</p>
        <div class="code">${code}</div>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't sign up for AcademEase, you can safely ignore this email.</p>
        <div class="footer">
          <p>AcademEase - Your Academic Companion</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate HTML for password reset email
 */
export async function getPasswordResetEmailHTML(
  name: string,
  code: string,
  resetLink: string
): Promise<string> {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset your AcademEase password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .code {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 5px;
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>AcademEase</h1>
        </div>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Use the following code to reset your password:</p>
        <div class="code">${code}</div>
        <p>Or click the button below to reset your password:</p>
        <div style="text-align: center;">
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>
        <p>This link and code will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <div class="footer">
          <p>AcademEase - Your Academic Companion</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
