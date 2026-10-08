from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Document(models.Model):
    owner = models.ForeignKey(User,on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return self.file.name
    
class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    content = models.TextField()
    uplodaed_at = models.DateField(auto_now_add=True)