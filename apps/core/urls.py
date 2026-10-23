from django.urls import path
from . import views


urlpatterns = [
    path("", views.home, name="home"),
    path("robots.txt", views.robots_txt, name="robots_txt"),

    path(
        "blog/<slug:slug>/",
        views.single_blog,
        name="single_blog",
    ),
    path("contact/", views.contact, name="contact"),

]
