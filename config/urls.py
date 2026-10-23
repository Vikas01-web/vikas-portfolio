from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import include, path

from apps.core.sitemaps import (
    BlogSitemap,
    CaseStudySitemap,
    ProjectSitemap,
    StaticPagesSitemap,
)


sitemaps = {
    "static": StaticPagesSitemap,
    "blogs": BlogSitemap,
    "projects": ProjectSitemap,
    "case-studies": CaseStudySitemap,
}

urlpatterns = [
    path("admin/", admin.site.urls),
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="sitemap"),
    path("", include("apps.core.urls")),
    path("work/", include("apps.portfolio.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
