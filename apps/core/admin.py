from django.contrib import admin
from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "published_date",
        "featured",
    )

    list_filter = (
        "category",
        "featured",
        "published_date",
    )

    search_fields = (
        "title",
        "category",
        "content",
    )

    prepopulated_fields = {
        "slug": ("title",)
    }

    ordering = (
        "-published_date",
    )