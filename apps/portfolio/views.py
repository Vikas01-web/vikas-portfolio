
from django.shortcuts import get_object_or_404, render
from .models import Project


CASE_STUDIES = {
    "mpi-job-portal": {
        "title": "MPI Job Portal",
        "category": "Web Development",
        "description": (
            "A job portal project developed during my "
            "experience at Digital Terrene."
        ),
        "challenge": "Organised job discovery",
        "solution": (
            "Developing job-related workflows and a "
            "user-friendly portal experience."
        ),
        "technologies": ["PHP", "MySQL", "JavaScript", "Bootstrap"],
        "image_url": "https://images.unsplash.com/photo-1782898669123-34d615cdc94b?auto=format&fit=crop&fm=jpg&q=85&w=2200",
        "image_credit_url": "https://unsplash.com/photos/man-viewing-a-laptop-screen-displaying-a-business-webpage-_Ir2ZwaG6V8",
        "image_credit": "Rodrigo Rodrigues / Unsplash",
        "project_goal": "Make job opportunities easier to explore and support a clear path through job-related workflows.",
        "context": "The project was developed during my experience at Digital Terrene. The case study focuses on the job seeker journey and the portal experience.",
        "focus_points": ["Organising job discovery", "Keeping key actions easy to find", "Supporting a clear journey from browsing to applying"],
        "reflection": "A useful job portal depends on clear information and a predictable journey. The interface should help people understand what to do next at each step.",
    },
    "website-debugging-maintenance": {
        "title": "Website Debugging & Maintenance",
        "category": "Debugging & Maintenance",
        "description": (
            "Website troubleshooting and maintenance work "
            "for jasminejhaveri.com."
        ),
        "challenge": "Website troubleshooting",
        "solution": (
            "Investigating website issues and working "
            "towards improved stability."
        ),
        "technologies": ["Website Fixes", "Maintenance"],
        "image_url": "https://images.unsplash.com/photo-1792004450230-8765a18d7ac0?auto=format&fit=crop&fm=jpg&q=85&w=2200",
        "image_credit_url": "https://unsplash.com/photos/laptop-screen-with-system-monitoring-terminal-d8o0hJ1NZ1c",
        "image_credit": "Lazar Stankovic / Unsplash",
        "project_goal": "Support a more stable website through focused troubleshooting and maintenance.",
        "context": "This work covered website troubleshooting and maintenance for jasminejhaveri.com. The focus was on investigating reported issues and improving stability.",
        "focus_points": ["Reproducing and isolating reported issues", "Applying targeted website fixes", "Checking the affected experience after changes"],
        "reflection": "Maintenance works best when each change is checked in context. Small, careful fixes help protect the surrounding experience while addressing the issue at hand.",
    },
    "wordpress-website-development": {
        "title": "Business Website Development",
        "category": "WordPress Development",
        "description": (
            "WordPress website development work for "
            "Paramahansa Defence AI and Interkem Dyestuff Co."
        ),
        "challenge": "Business website requirements",
        "solution": (
            "Implementing website layouts and responsive "
            "business website experiences."
        ),
        "technologies": ["WordPress", "Responsive UI"],
        "image_url": "https://images.unsplash.com/photo-1502882705085-fd1fd2ecefd0?auto=format&fit=crop&fm=jpg&q=85&w=2200",
        "image_credit_url": "https://unsplash.com/photos/graphical-user-interface-website-KI6oMSTKcf8",
        "image_credit": "Unsplash (illustrative reference)",
        "project_goal": "Build responsive business website experiences around each organisation's content and requirements.",
        "context": "The work included WordPress website development for Paramahansa Defence AI and Interkem Dyestuff Co., with attention to layout and responsive presentation.",
        "focus_points": ["Structuring business information", "Building layouts in WordPress", "Checking responsive presentation across screen sizes"],
        "reflection": "A business website needs to make its information easy to scan while staying consistent across devices. Content structure and responsive layout work together to make that possible.",
    },
}


def project_list(request):
    projects = Project.objects.all()
    return render(
        request,
        "projects/index.html",
        {"projects": projects},
    )


def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    return render(
        request,
        "projects/detail.html",
        {"project": project},
    )


def case_study_list(request):
    return render(
        request,
        "home/case_study_list.html",
        {
            "case_studies": CASE_STUDIES,
            "featured_case_study": CASE_STUDIES["mpi-job-portal"],
        },
    )


def case_study_detail(request, slug):
    case_study = CASE_STUDIES.get(slug)

    if case_study is None:
        return render(
            request,
            "404.html",
            status=404,
        )

    related_case_studies = [
        {"slug": other_slug, **other_study}
        for other_slug, other_study in CASE_STUDIES.items()
        if other_slug != slug
    ]

    return render(
        request,
        "home/case_study_detail.html",
        {
            "case_study": {"slug": slug, **case_study},
            "related_case_studies": related_case_studies,
        },
    )
