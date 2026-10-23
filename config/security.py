import secrets

from django.conf import settings


class ContentSecurityPolicyMiddleware:
    """Add a nonce-based CSP to public pages without breaking Django admin."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        nonce = secrets.token_urlsafe(18)
        request.csp_nonce = nonce
        response = self.get_response(request)

        # Django admin includes its own inline scripts; keep its built-in UI
        # functional while the public portfolio uses a strict script policy.
        if request.path.startswith("/admin/"):
            return response

        directives = [
            "default-src 'self'",
            f"script-src 'self' 'nonce-{nonce}'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self'",
            "frame-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
        ]
        if settings.SECURE_SSL_REDIRECT:
            directives.append("upgrade-insecure-requests")

        response.headers.setdefault("Content-Security-Policy", "; ".join(directives))
        return response
