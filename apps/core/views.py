from django.shortcuts import render, get_object_or_404
from .models import BlogPost


def home(request):
    return render(request, "home/index.html")


def single_blog(request, slug):
    blog = get_object_or_404(BlogPost, slug=slug)

    return render(
        request,
        "home/single-blog.html",
        {
            "blog": blog
        }
    )