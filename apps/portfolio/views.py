from django.shortcuts import get_object_or_404, render
from .models import Project

def project_list(request):
    projects = Project.objects.all()
    return render(request, "projects/index.html", {"projects": projects})

def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(request, "projects/detail.html", {"project": project})
