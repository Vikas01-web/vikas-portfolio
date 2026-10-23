# Portfolio SEO and Search Console setup

## Before publishing

1. Deploy the site to its final HTTPS domain.
2. In the hosting provider's environment settings, set `DEBUG=False`, a unique `SECRET_KEY` with at least 50 characters, and `ALLOWED_HOSTS` to the exact hostnames you use (for example, `example.com,www.example.com`). Set `CSRF_TRUSTED_ORIGINS` to the matching HTTPS origins if the site uses more than one origin.
3. Set `SITE_URL` to the preferred canonical origin, including `https://` and with no trailing slash (for example, `https://example.com`). Keep the other hostname redirected to this one.
4. Keep `.env` out of Git. Set `GOOGLE_SITE_VERIFICATION` to the content value from Search Console if you choose HTML-tag verification. The rendered home page will include Google's exact verification meta tag.
5. Set `EMAIL_HOST_PASSWORD` to the Gmail App Password in the host's secret/environment settings if contact-form email delivery is needed. Do not commit or share the secret.
6. Keep HTTPS redirects and secure cookies enabled in production. Only enable HSTS for subdomains when every subdomain is HTTPS-only; leave preload off until the final domain is permanently HTTPS-only.

## Add the property to Google Search Console

- For a Domain property, enter only the root domain (no scheme or path), then add the DNS TXT record Google gives you.
- For a URL-prefix property, enter the preferred full HTTPS URL, including the final slash. You can verify it with Google's HTML meta tag by copying its content value into `GOOGLE_SITE_VERIFICATION`.
- Deploy after setting the verification value, then use Search Console's Verify button.
- Submit `https://your-real-domain.com/sitemap.xml` in Search Console's Sitemaps report, replacing the example with the exact `SITE_URL` origin.
- Check `https://your-real-domain.com/robots.txt` and `https://your-real-domain.com/sitemap.xml` in a browser after deployment. The sitemap includes the home page, published blog records, projects, and case studies.

Google uses sitemap submissions as a discovery hint; they do not guarantee indexing or a ranking position. Keep page titles, descriptions, and blog content accurate and useful.
