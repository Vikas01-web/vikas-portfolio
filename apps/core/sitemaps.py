from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.utils import timezone

from apps.core.models import BlogPost
from apps.portfolio.models import Project
from apps.portfolio.views import CASE_STUDIES


class StaticPagesSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return ("home", "project_list", "case_study_list")

    def location(self, item):
        return reverse(item)


class BlogSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return BlogPost.objects.filter(
            published_date__lte=timezone.localdate()
        ).order_by("-published_date")

    def location(self, item):
        return reverse("single_blog", kwargs={"slug": item.slug})

    def lastmod(self, item):
        return item.published_date


class ProjectSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Project.objects.order_by("-updated_at")

    def location(self, item):
        return reverse("project_detail", kwargs={"slug": item.slug})

    def lastmod(self, item):
        return item.updated_at


class CaseStudySitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return list(CASE_STUDIES)

    def location(self, item):
        return reverse("case_study_detail", kwargs={"slug": item})
