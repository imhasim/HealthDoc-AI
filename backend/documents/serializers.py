from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file', 'uploaded_at']
        
    def validate_file(self, file):
        
        if not file.name.lower().endswith(".pdf"):
            raise serializers.ValidationError(" only pdf allowed :")
        
        if file.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(" only file size : ")
        
        return file
    
    