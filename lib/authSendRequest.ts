import { SITE_TITLE } from "./CONSTANTS"

type Props = {
  identifier: string,
  provider: {
    apiKey: string,
    from: string,
  },
  url: string
}

const theme = {
  brandColor: "#21429a",
  background: "#f9f9f9",
  text: "#444",
  buttonColor: "#21429a",
  buttonText: "#fff",
}

export async function sendVerificationRequest(params: Props) {
  const { identifier: to, provider, url } = params
  const { host } = new URL(url)
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: provider.from,
      to,
      subject: `Sign in to ${host}`,
      html: html({ url, host }),
      text: text({ url, host }),
    }),
  })

  if (!res.ok) throw new Error("Resend error: " + JSON.stringify(await res.json()));
}

function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = theme.brandColor || "#222";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  }

  const logoUrl = `${new URL(url).origin}/_next/image?url=%2Flogo.png&w=128&q=75`;

  return `
<body style="background: ${color.background}; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: ${color.background}; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header with Logo -->
        <tr>
          <td align="center" style="padding: 40px 40px 20px 40px; background: #fff9e6;">
            <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <!-- Brand Logo -->
                    <img src=${logoUrl} alt="${SITE_TITLE} Website Logo" width="64" height="64" style="display: block; border: 0;" />
                </td>
              </tr>
              <tr>
                <td align="center">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: ${brandColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    Welcome
                  </h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 40px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding-bottom: 30px;">
                  <h2 style="margin: 0; font-size: 24px; font-weight: 600; color: ${color.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.3;">
                    Sign in to <strong>${SITE_TITLE}</strong>
                  </h2>
                  <p style="margin: 12px 0 0 0; font-size: 16px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">
                    Click the button below to securely sign in to your account
                  </p>
                </td>
              </tr>

              <!-- Sign In Button -->
              <tr>
                <td align="center" style="padding: 20px 0 30px 0;">
                  <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="border-radius: 12px; background: ${brandColor}; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
                        <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; font-size: 16px; font-weight: 600; color: white; text-decoration: none; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; transition: all 0.2s ease;">
                          Sign in to your account
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Security Info -->
              <tr>
                <td style="padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid ${brandColor};">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <p style="margin: 0; font-size: 14px; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">
                          <strong style="color: #1f2937;">Security notice:</strong><br>
                          This link will expire in 1 hour for your security. If you didn't request this email, you can safely ignore it.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Alternative Link -->
              <tr>
                <td align="center" style="padding-top: 30px;">
                  <p style="margin: 0; font-size: 14px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">
                    Having trouble with the button? Copy and paste this link into your browser:
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; word-break: break-all; background: #f3f4f6; padding: 8px 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
                    ${url}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 30px 40px; background: #f8fafc; border-top: 1px solid #e5e7eb;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center">
                  <p style="margin: 0; font-size: 12px; color: #6b7280; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5;">
                    This email was sent to you because a sign-in was requested for your account.<br>
                    If you have any questions, please contact our support team.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top: 16px;">
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    © ${new Date().getFullYear()} ${escapedHost}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}