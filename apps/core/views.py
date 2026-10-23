import logging

from django.conf import settings
from django.core.cache import cache
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.template.loader import render_to_string
from django.utils import timezone

from .models import BlogPost


logger = logging.getLogger(__name__)


def home(request):
    return render(request, "home/index.html")


def single_blog(request, slug):
    blog = get_object_or_404(
        BlogPost,
        slug=slug,
        published_date__lte=timezone.localdate(),
    )

    return render(
        request,
        "home/single-blog.html",
        {
            "blog": blog
        }
    )


def robots_txt(request):
    sitemap_url = request.build_absolute_uri(reverse("sitemap"))
    content = "\n".join(
        (
            "User-agent: *",
            "Allow: /",
            "Disallow: /admin/",
            f"Sitemap: {sitemap_url}",
            "",
        )
    )
    return HttpResponse(content, content_type="text/plain; charset=utf-8")

def contact(request):
    if request.method != "POST":
        return redirect("home")

    # Quietly discard automated submissions that fill the visually hidden field.
    if request.POST.get("company_website", "").strip():
        return redirect("/#contact")

    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    subject = request.POST.get("subject", "").strip()
    message = request.POST.get("message", "").strip()
    subject = " ".join(subject.splitlines()).strip()

    if not all([name, email, subject, message]):
        messages.error(request, "Please fill in all fields.")
        return redirect("/#contact")

    if len(name) > 100 or len(email) > 254 or len(subject) > 150 or len(message) > 5000:
        messages.error(request, "Please shorten your message and try again.")
        return redirect("/#contact")

    try:
        validate_email(email)
    except ValidationError:
        messages.error(request, "Please enter a valid email address.")
        return redirect("/#contact")

    if not settings.EMAIL_HOST_PASSWORD:
        logger.error("Contact mail is not configured: EMAIL_HOST_PASSWORD is empty")
        messages.error(
            request,
            f"Email delivery is temporarily unavailable. Please email {settings.CONTACT_EMAIL} directly.",
        )
        return redirect("/#contact")

    # Basic per-IP throttling to reduce contact-form spam. Use the direct
    # connection address; do not trust a user-supplied X-Forwarded-For header.
    client_ip = request.META.get("REMOTE_ADDR", "unknown")
    throttle_key = f"contact-submit:{client_ip}"
    if not cache.add(throttle_key, 1, timeout=60):
        messages.error(request, "Please wait a minute before sending another message.")
        return redirect("/#contact")

    try:
        context = {
            "site_name": settings.SITE_NAME,
            "subject": subject,
            "sender_name": name,
            "sender_email": email,
            "message": message,
        }
        text_body = render_to_string("emails/contact_notification.txt", context)
        html_body = render_to_string("emails/contact_notification.html", context)
        email_message = EmailMultiAlternatives(
            subject=f"New portfolio inquiry: {subject}",
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[email],
        )
        email_message.attach_alternative(html_body, "text/html")
        sent_count = email_message.send(fail_silently=False)

        if sent_count != 1:
            raise RuntimeError("The contact email backend did not send a message.")

        messages.success(request, "Your message has been sent!")
    except Exception:
        logger.exception("Portfolio contact email delivery failed")
        messages.error(
            request,
            f"Your message could not be sent right now. Please email {settings.CONTACT_EMAIL} directly."
        )

    return redirect("/#contact")
