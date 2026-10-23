from django.conf import settings
from django.templatetags.static import static


def seo(request):
    """Expose canonical URLs and configurable Search Console metadata."""
    site_origin = settings.SITE_URL or request.build_absolute_uri("/").rstrip("/")
    canonical_url = f"{site_origin}{request.path}"

    return {
        "site_name": settings.SITE_NAME,
        "contact_email": settings.CONTACT_EMAIL,
        "site_origin": site_origin,
        "csp_nonce": getattr(request, "csp_nonce", ""),
        "canonical_url": canonical_url,
        "seo_image_url": request.build_absolute_uri(static("images/profile/vikas-hero.png")),
        "google_site_verification": settings.GOOGLE_SITE_VERIFICATION,
    }
