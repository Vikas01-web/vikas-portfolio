from pathlib import Path
import os

from dotenv import load_dotenv


# =========================================================
# BASE DIRECTORY
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================

load_dotenv(BASE_DIR / ".env")


# =========================================================
# SECURITY
# =========================================================

SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-key")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Refuse to start an unsafe production configuration instead of silently
# running with Django's development secret.
if not DEBUG and (
    len(SECRET_KEY) < 50
    or SECRET_KEY in {"dev-only-secret-key", "change-this-in-production"}
):
    raise RuntimeError(
        "Set a unique SECRET_KEY of at least 50 characters in the production environment."
    )


# Render hostname + local development hosts
RENDER_EXTERNAL_HOSTNAME = os.getenv("RENDER_EXTERNAL_HOSTNAME", "").strip()
default_allowed_hosts = ",".join(
    filter(None, ("127.0.0.1,localhost", RENDER_EXTERNAL_HOSTNAME))
)
allowed_hosts_env = os.getenv("ALLOWED_HOSTS", default_allowed_hosts).strip()
ALLOWED_HOSTS = [
    host.strip()
    for host in (allowed_hosts_env or default_allowed_hosts).split(",")
    if host.strip()
]

if not DEBUG and "*" in ALLOWED_HOSTS:
    raise RuntimeError("Do not use a wildcard ALLOWED_HOSTS value in production.")

LOCAL_ONLY_HOSTS = {"127.0.0.1", "localhost", "[::1]"}
LOCAL_ONLY_CONFIGURATION = (
    not RENDER_EXTERNAL_HOSTNAME
    and bool(ALLOWED_HOSTS)
    and set(ALLOWED_HOSTS).issubset(LOCAL_ONLY_HOSTS)
)


# =========================================================
# APPLICATIONS
# =========================================================

INSTALLED_APPS = [

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",

    # Project apps
    "apps.core",
    "apps.portfolio",
]


# =========================================================
# MIDDLEWARE
# =========================================================

MIDDLEWARE = [

    "django.middleware.security.SecurityMiddleware",

    "config.security.ContentSecurityPolicyMiddleware",

    # Static files in production
    "whitenoise.middleware.WhiteNoiseMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# =========================================================
# URL CONFIGURATION
# =========================================================

ROOT_URLCONF = "config.urls"


# =========================================================
# TEMPLATES
# =========================================================

TEMPLATES = [

    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [
            BASE_DIR / "templates"
        ],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",
                "config.context_processors.seo",

            ],
        },
    },
]


# =========================================================
# WSGI / ASGI
# =========================================================

WSGI_APPLICATION = "config.wsgi.application"

ASGI_APPLICATION = "config.asgi.application"


# =========================================================
# DATABASE
# =========================================================
#
# Local:
#     SQLite
#
# Render:
#     PostgreSQL through DATABASE_URL
#
# =========================================================

DATABASE_URL = os.getenv("DATABASE_URL")


if DATABASE_URL:

    import dj_database_url  # type: ignore[import-not-found]

    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=True,
        )
    }

else:

    DATABASES = {

        "default": {

            "ENGINE": "django.db.backends.sqlite3",

            "NAME": BASE_DIR / "db.sqlite3",

        }

    }


# =========================================================
# PASSWORD VALIDATION
# =========================================================

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# =========================================================
# INTERNATIONALIZATION
# =========================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Kolkata"

USE_I18N = True

USE_TZ = True


# =========================================================
# STATIC FILES
# =========================================================

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    BASE_DIR / "static"
]

STATIC_ROOT = BASE_DIR / "staticfiles"


# WhiteNoise compressed static files
STORAGES = {

    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },

    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },

}


# =========================================================
# MEDIA FILES
# =========================================================

MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


# =========================================================
# CONTACT EMAIL
# =========================================================

CONTACT_EMAIL = os.getenv(
    "CONTACT_EMAIL",
    "vikas7501kumar@gmail.com",
).strip()
SITE_NAME = os.getenv("SITE_NAME", "Vikas Kumar | Portfolio").strip()
SITE_URL = (
    os.getenv("SITE_URL", "").strip().rstrip("/")
    or (f"https://{RENDER_EXTERNAL_HOSTNAME}" if RENDER_EXTERNAL_HOSTNAME else "")
)
GOOGLE_SITE_VERIFICATION = os.getenv("GOOGLE_SITE_VERIFICATION", "").strip()

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    "django.core.mail.backends.smtp.EmailBackend",
).strip()
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com").strip()
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "False").lower() == "true"
EMAIL_HOST_USER = os.getenv(
    "EMAIL_HOST_USER",
    "vikas7501kumar@gmail.com",
).strip()
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "").strip().replace(" ", "")
EMAIL_TIMEOUT = int(os.getenv("EMAIL_TIMEOUT", "15"))
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "").strip() or (
    f"Vikas Kumar <{EMAIL_HOST_USER or 'webmaster@localhost'}>"
)


# =========================================================
# SECURITY / CSRF
# =========================================================

CSRF_TRUSTED_ORIGINS = [

    origin.strip()
    for origin in os.getenv(
        "CSRF_TRUSTED_ORIGINS",
        ""
    ).split(",")

    if origin.strip()

]

# Production-only transport and browser security headers. Keep the values
# configurable for hosts that terminate TLS at a trusted reverse proxy.
SECURE_SSL_REDIRECT = os.getenv(
    "SECURE_SSL_REDIRECT", str(not DEBUG and not LOCAL_ONLY_CONFIGURATION)
).lower() == "true"
SESSION_COOKIE_SECURE = os.getenv(
    "SESSION_COOKIE_SECURE", str(not DEBUG and not LOCAL_ONLY_CONFIGURATION)
).lower() == "true"
CSRF_COOKIE_SECURE = os.getenv(
    "CSRF_COOKIE_SECURE", str(not DEBUG and not LOCAL_ONLY_CONFIGURATION)
).lower() == "true"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = int(os.getenv(
    "SECURE_HSTS_SECONDS",
    "31536000" if not DEBUG and not LOCAL_ONLY_CONFIGURATION else "0",
))
SECURE_HSTS_INCLUDE_SUBDOMAINS = os.getenv(
    "SECURE_HSTS_INCLUDE_SUBDOMAINS", "False"
).lower() == "true"
SECURE_HSTS_PRELOAD = os.getenv(
    "SECURE_HSTS_PRELOAD", "False"
).lower() == "true"

# Render terminates HTTPS at its managed proxy and forwards the original
# protocol in this header. Trust it only on Render-managed deployments.
if RENDER_EXTERNAL_HOSTNAME:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

DATA_UPLOAD_MAX_MEMORY_SIZE = 1_048_576
DATA_UPLOAD_MAX_NUMBER_FIELDS = 100


# =========================================================
# DEFAULT PRIMARY KEY
# =========================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
