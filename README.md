# Motsoalle website

Static website for Motsoalle: plain HTML, CSS and JavaScript. No build step, so Vercel serves it as-is.

## Pages

| Page | File | URL |
|---|---|---|
| Home | `index.html` | `/` |
| For learners | `learners.html` | `/learners` |
| How it works | `how-it-works.html` | `/how-it-works` |
| For partners (onboarding + enquiry form) | `partners.html` | `/partners` |
| About | `about.html` | `/about` |
| Privacy summary | `privacy.html` | `/privacy` |
| Not found | `404.html` | any missing page |

## Deploy on Vercel through GitHub

1. Create a new GitHub repository (for example `motsoalle-website`) and upload everything in this folder to it, keeping the folder structure.
2. In Vercel, choose **Add New → Project**, import the repository, and leave every setting at its default. Framework preset: **Other**. No build command, no output directory.
3. Click **Deploy**. Every push to the main branch redeploys the site.

To use `motsoalle.vercel.app`, add this repository to your existing Vercel project (or move the domain to the new project) under **Settings → Domains**.

## Make the partner form email you (5 minutes)

The form works straight away: without a key, it prepares the enquiry and lets the partner send it by email or WhatsApp.

To receive enquiries directly in your inbox:

1. Go to https://web3forms.com, enter `motsoalle@trwebsolutions.com` and get a free access key.
2. Open `assets/js/main.js` and paste the key into `WEB3FORMS_KEY: ""`.
3. Commit and push. Test the form once on the live site.

The same file sets the fallback email (`PARTNER_EMAIL`) and the WhatsApp number partners can message (`PARTNER_WHATSAPP`). Change them there.

## Editing content

- Text lives directly in each `.html` file. The header and footer are repeated on every page, so change them in all files.
- Colours and spacing are in `assets/css/styles.css` (variables at the top).
- Images are in `assets/img/`, saved as WebP to keep the site light on mobile data.

## Preview locally

From this folder run `npx serve .` and open the address it prints. Clean URLs like `/partners` work there, as on Vercel.
