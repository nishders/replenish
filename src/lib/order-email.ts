import 'server-only';
import { formatOrderDate, formatOrderNumber, type OrderLine } from './orders';

// Order confirmation email, sent by the website's server through Resend's API (not by Supabase).
// Brand-font text is images hosted on the live site, like the Supabase auth email templates.

const LIVE = 'https://reple-nish.vercel.app';
const IMG = `${LIVE}/email/`;
const FROM = 'replenish <noreply@mail.replenish.oldmonkeygames.com>';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function html({ number, date, lines, link }: { number: string; date: string; lines: OrderLine[]; link: string }) {
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const rows = lines
    .map(
      (l) => `<tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #0f2422; font-size: 17px; font-weight: 600">${esc(l.name)}</td>
        <td align="right" style="padding: 12px 0; border-bottom: 1px solid #0f2422; font-family: 'DM Mono', Menlo, monospace; font-size: 15px; white-space: nowrap">&times; ${l.quantity}</td>
        <td align="right" width="56" style="padding: 12px 0; border-bottom: 1px solid #0f2422; font-family: 'DM Mono', Menlo, monospace; font-size: 14px; color: #33504d">free</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>order ${number} placed</title>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=DM+Mono&display=swap" rel="stylesheet" />
  </head>
  <body style="margin: 0; padding: 0; background: #f8e5cf">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8e5cf">
      <tr>
        <td align="center" style="padding: 40px 12px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #fffaf3; border: 2.5px solid #0f2422; border-radius: 24px; border-collapse: separate; overflow: hidden">
            <tr>
              <td style="background: #0b7c74; padding: 24px 32px; border-bottom: 2.5px solid #0f2422; border-radius: 21px 21px 0 0">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 28px; font-weight: 700; color: #fffaf3">
                      <img src="${IMG}logo-cream.png" width="165" height="43" alt="replenish" style="display: block; border: 0; color: #fffaf3" />
                    </td>
                    <td align="right" style="font-family: 'DM Mono', Menlo, monospace; font-size: 13px; color: #fffaf3">order ${number}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 36px 32px 32px; font-family: 'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif; color: #0f2422">
                <h1 style="margin: 0 0 12px; font-family: Georgia, serif; font-weight: 400; font-size: 34px; line-height: 1.05">
                  <img src="${IMG}order-title.png" width="244" height="38" alt="order placed!" style="display: block; border: 0; max-width: 100%; height: auto" />
                </h1>
                <p style="margin: 0 0 24px; font-size: 17px; line-height: 1.5">nothing is on its way. here's everything you didn't pay for.</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #fffaf3; border: 2.5px solid #0f2422; border-radius: 20px; border-collapse: separate">
                  <tr>
                    <td style="padding: 16px 20px">
                      <div style="font-family: 'DM Mono', Menlo, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #33504d">order number</div>
                      <div style="font-family: 'DM Mono', Menlo, monospace; font-size: 28px; font-weight: 500; line-height: 1.2">#${number}</div>
                    </td>
                    <td align="right" style="padding: 16px 20px; border-left: 2.5px dashed #0f2422">
                      <div style="font-family: 'DM Mono', Menlo, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #33504d">placed</div>
                      <div style="font-family: 'DM Mono', Menlo, monospace; font-size: 17px; font-weight: 500; line-height: 1.4; white-space: nowrap">${date}</div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; border-top: 1px solid #0f2422">
                  ${rows}
                  <tr>
                    <td style="padding: 14px 0 0; font-family: 'DM Mono', Menlo, monospace; font-size: 14px; color: #33504d">${count} ${count === 1 ? 'can' : 'cans'} · 0g protein</td>
                    <td colspan="2" align="right" style="padding: 14px 0 0; font-size: 20px; font-weight: 700; color: #0b7c74">total: free</td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 28px">
                  <tr>
                    <td align="center" style="background: #ffb547; border: 2.5px solid #0f2422; border-radius: 999px; box-shadow: 4px 4px 0 #0f2422">
                      <a href="${link}" style="display: block; padding: 18px 24px; font-family: 'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif; font-size: 19px; font-weight: 700; color: #0f2422; text-decoration: none">view your order</a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 24px 0 8px; font-size: 20px; line-height: 1.1; color: #0b7c74">
                  <img src="${IMG}confirm-aside.png" width="446" height="37" alt="it's the only thing we'll ever actually deliver." style="display: block; border: 0; max-width: 100%; height: auto" />
                </p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; background: #fff3e6; border: 1.5px solid #0f2422; border-radius: 16px; border-collapse: separate">
                  <tr>
                    <td width="21" valign="top" style="padding: 16px 0 14px 18px">
                      <img src="${IMG}icon-package.png" width="21" height="22" alt="" style="display: block; border: 0" />
                    </td>
                    <td style="padding: 14px 18px 14px 10px; font-size: 15px; line-height: 1.45; font-weight: 600">delivery status: packing nothing. estimated arrival: never.</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 32px 22px; border-top: 1px solid #0f2422; font-family: 'DM Mono', Menlo, monospace; font-size: 12px; line-height: 1.5; color: #33504d">
                replenish is a portfolio project. please do not attempt to drink this email.<br />
                designed &amp; built by nish
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function text({ number, date, lines, link }: { number: string; date: string; lines: OrderLine[]; link: string }) {
  return [
    `order placed! nothing is on its way.`,
    ``,
    `order #${number} · placed ${date}`,
    ...lines.map((l) => `- ${l.name} × ${l.quantity} (free)`),
    `total: free`,
    ``,
    `view your order: ${link}`,
    ``,
    `replenish is a portfolio project. please do not attempt to drink this email.`,
  ].join('\n');
}

// Sends the confirmation. Returns false (never throws) so a failed email never undoes a placed order.
export async function sendOrderEmail({ to, orderNumber, createdAt, lines, origin }: { to: string; orderNumber: number; createdAt: string; lines: OrderLine[]; origin: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[order-email] RESEND_API_KEY is not set; skipping the confirmation email');
    return false;
  }
  const number = formatOrderNumber(orderNumber);
  const data = { number, date: formatOrderDate(createdAt, 'UTC'), lines, link: `${origin}/order/${number}` };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `order-${number}` },
      body: JSON.stringify({ from: FROM, to: [to], subject: `order #${number} placed. nothing is on its way.`, html: html(data), text: text(data) }),
    });
    if (!res.ok) console.warn('[order-email] Resend said', res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.warn('[order-email] could not reach Resend', err);
    return false;
  }
}
