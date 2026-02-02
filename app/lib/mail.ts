// lib/mail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendUserCredentialsEmail({
  to,
  username,
  password,
}: {
  to: string;
  username: string;
  password: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "FleetCo <noreply@fleetcotelematics.com>", // replace with your verified domain
      to,
      subject: "Welcome to FleetCo Telematics!",
      html: `
  <div style="background-color:#f6f8fa; padding:40px 0; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(to right, #004953, #004953); padding:24px; text-align:center;">
        <div style="width:56px; height:56px; background:linear-gradient(to bottom right,##004953,##004953); border:1px solid rgba(255,255,255,0.3); border-color:white; border-radius:16px; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:700; box-shadow:0 0 10px rgba(255,255,255,0.2);">
          <div>FC</div>
        </div>
        <div style="margin-top:10px;">
          <span style="font-size:28px; font-weight:700; color:white;">FleetCo</span>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <h2 style="color:#111827;">Welcome to FleetCo Telematics!</h2>
        <p style="color:#374151; line-height:1.6;">
          We're thrilled to have you join our platform — where intelligent fleet management meets simplicity and precision.
        </p>

        <div style="margin:24px 0; padding:20px; background-color:#f3f4f6; border-radius:8px;">
          <p style="margin:0 0 8px; color:#111827; font-weight:600;">Here are your login credentials:</p>
          <p style="margin:4px 0; color:#374151;">Username: <strong>${username}</strong></p>
          <p style="margin:4px 0; color:#374151;">Password: <strong>${password}</strong></p>
        </div>

        <p style="color:#374151; line-height:1.6;">
          You can access your dashboard and start managing your vehicles right away:
        </p>

        <div style="text-align:center; margin:24px 0;">
          <a href="https://solutions.fleetcotelematics.com/login"
             style="display:inline-block; background:linear-gradient(to right, #2563eb, #1d4ed8); color:white; padding:12px 24px; border-radius:8px; font-weight:600; text-decoration:none;">
             Go to Dashboard
          </a>
        </div>

        <p style="color:#6b7280; font-size:14px; line-height:1.5;">
          If you didn't request this account, please ignore this message or contact our support team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#f9fafb; text-align:center; padding:16px; color:#9ca3af; font-size:12px;">
        © ${new Date().getFullYear()} FleetCo Telematics. All rights reserved.
      </div>
    </div>
  </div>
      `,
    });

    return data;
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

export async function sendOtpEmail({
  to,
  otp,
  userName,
}: {
  to: string;
  otp: string;
  userName: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "FleetCo <noreply@fleetcotelematics.com>",
      to,
      subject: "Password Reset OTP - FleetCo",
      html: `
  <div style="background-color:#f6f8fa; padding:40px 0; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(to right, #004953, #004953); padding:24px; text-align:center;">
        <div style="width:56px; height:56px; margin:0 auto; background:white; border-radius:16px; display:inline-flex; align-items:center; justify-content:center; color:#004953; font-size:24px; font-weight:700; box-shadow:0 0 10px rgba(255,255,255,0.2);">
          <div>FC</div>
        </div>
        <div style="margin-top:10px;">
          <span style="font-size:28px; font-weight:700; color:white;">FleetCo</span>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <h2 style="color:#111827; margin-bottom:16px;">Password Reset Request</h2>
        <p style="color:#374151; line-height:1.6; margin-bottom:24px;">
          Hi ${userName},
        </p>
        <p style="color:#374151; line-height:1.6; margin-bottom:24px;">
          We received a request to reset your password. Use the OTP code below to complete the process:
        </p>

        <!-- OTP Display -->
        <div style="margin:32px 0; padding:24px; background:linear-gradient(135deg, #004953 0%, #006b7a 100%); border-radius:12px; text-align:center;">
          <p style="margin:0 0 8px; color:rgba(255,255,255,0.9); font-size:14px; font-weight:500; letter-spacing:1px;">YOUR OTP CODE</p>
          <div style="font-size:42px; font-weight:700; color:white; letter-spacing:8px; font-family:'Courier New', monospace;">
            ${otp}
          </div>
          <p style="margin:12px 0 0; color:rgba(255,255,255,0.8); font-size:13px;">
            This code expires in 3 minutes
          </p>
        </div>

        <div style="background-color:#fef3c7; border-left:4px solid #f59e0b; padding:16px; border-radius:8px; margin:24px 0;">
          <p style="margin:0; color:#92400e; font-size:14px; line-height:1.5;">
            <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team immediately.
          </p>
        </div>

        <p style="color:#6b7280; font-size:14px; line-height:1.5; margin-top:24px;">
          For security reasons, this OTP will expire in 3 minutes. If you need a new code, you can request another one from the password reset page.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#f9fafb; text-align:center; padding:16px; color:#9ca3af; font-size:12px;">
        © ${new Date().getFullYear()} FleetCo Telematics. All rights reserved.
      </div>
    </div>
  </div>
      `,
    });

    return data;
  } catch (error) {
    console.error("OTP email sending failed:", error);
    throw error;
  }
}

export async function sendNotificationEmail({
  to,
  userName,
  title,
  message,
  link,
  notificationType,
}: {
  to: string;
  userName: string;
  title: string;
  message: string;
  link?: string;
  notificationType: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "FleetCo <noreply@fleetcotelematics.com>",
      to,
      subject: title,
      html: `
  <div style="background-color:#f6f8fa; padding:40px 0; font-family:Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(to right, #004953, #004953); padding:24px; text-align:center;">
        <div style="width:56px; height:56px; margin:0 auto; background:white; border-radius:16px; display:inline-flex; align-items:center; justify-content:center; color:#004953; font-size:24px; font-weight:700; box-shadow:0 0 10px rgba(255,255,255,0.2);">
          <div>FC</div>
        </div>
        <div style="margin-top:10px;">
          <span style="font-size:28px; font-weight:700; color:white;">FleetCo</span>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <h2 style="color:#111827; margin-bottom:16px;">${title}</h2>
        <p style="color:#374151; line-height:1.6; margin-bottom:24px;">
          Hi ${userName},
        </p>
        <p style="color:#374151; line-height:1.6; margin-bottom:24px;">
          ${message}
        </p>

        ${
          link
            ? `
        <!-- Action Button -->
        <div style="text-align:center; margin:32px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://solutions.fleetcotelematics.com"}${link}"
             style="display:inline-block; background:linear-gradient(to right, #004953, #006b7a); color:white; padding:14px 32px; border-radius:8px; font-weight:600; text-decoration:none; box-shadow:0 4px 12px rgba(0,73,83,0.3);">
             View Details
          </a>
        </div>
        `
            : ""
        }

        <!-- Info Box -->
        <div style="background-color:#f3f4f6; border-left:4px solid #004953; padding:16px; border-radius:8px; margin:24px 0;">
          <p style="margin:0; color:#374151; font-size:14px; line-height:1.5;">
            <strong>Notification Type:</strong> ${notificationType}
          </p>
        </div>

        <p style="color:#6b7280; font-size:14px; line-height:1.5; margin-top:24px;">
          You received this notification because you are subscribed to <strong>${notificationType}</strong> alerts in your notification group settings.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#f9fafb; text-align:center; padding:16px; color:#9ca3af; font-size:12px;">
        © ${new Date().getFullYear()} FleetCo Telematics. All rights reserved.
      </div>
    </div>
  </div>
      `,
    });

    console.log(`[Email] Sent notification to ${to}: ${title}`);
    return data;
  } catch (error) {
    console.error("Notification email sending failed:", error);
    throw error;
  }
}
