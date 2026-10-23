
from django.urls import path
from . import views

urlpatterns = [
    path("", views.project_list, name="project_list"),

    path(
        "case-studies/",
        views.case_study_list,
        name="case_study_list",
    ),

    path(
        "case-studies/<slug:slug>/",
        views.case_study_detail,
        name="case_study_detail",
    ),

    path(
        "<slug:slug>/",
        views.project_detail,
        name="project_detail",
    ),
]
