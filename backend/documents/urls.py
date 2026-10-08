
from .views import DocumentUploadedAPIView, DocumentListAPIView,ChatAPIView,DocumentDeleteAPIView
from django.urls import path
urlpatterns = [
    path('upload/',DocumentUploadedAPIView.as_view(), name = 'document-upload' ),
    path('', DocumentListAPIView.as_view(), name = 'document-list'),
    path("chat/",ChatAPIView.as_view(),name = "chat"),
    path("<int:document_id>/", DocumentDeleteAPIView.as_view(), name = "delete")
    
]