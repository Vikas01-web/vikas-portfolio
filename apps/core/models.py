from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    category = models.CharField(max_length=50)

    excerpt = models.TextField()

    content = models.TextField()

    image = models.CharField(max_length=255)

    read_time = models.PositiveIntegerField(default=5)

    published_date = models.DateField()

    featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-published_date"]

    def __str__(self):
        return self.title