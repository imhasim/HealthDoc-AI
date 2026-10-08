from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import DocumentSerializer
from .models import Document, DocumentChunk

from .utils import (
    split_text_into_chunks,
    create_embedding,
    store_chunk_in_chromadb,
    delete_document_from_chromadb,
    extract_text_from_pdf,
    ask_question,
)


class DocumentUploadedAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = DocumentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        document = None

        try:
            # Document database me save
            document = serializer.save(owner=request.user)

            # PDF se text extract
            text = extract_text_from_pdf(document.file)

            if not text or not text.strip():
                document.delete()

                return Response(
                    {
                        "error": "Could not extract readable text from this PDF."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Text ko chunks me divide
            chunks = split_text_into_chunks(text)

            if not chunks:
                document.delete()

                return Response(
                    {
                        "error": "No readable content found in this PDF."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Har chunk ka embedding + ChromaDB storage
            for i, chunk in enumerate(chunks):

                DocumentChunk.objects.create(
                    document=document,
                    content=chunk
                )

                embedding = create_embedding(chunk)

                store_chunk_in_chromadb(
                    chunk_id=f"document_id_{document.id}_chunk_id_{i}",
                    text=chunk,
                    embedding=embedding.tolist(),
                    document_id=document.id,
                    owner_id=request.user.id
                )

            # Original extracted text save
            document.text = text
            document.save()

            return Response(
                {
                    "message": "Document uploaded successfully",
                    "document_id": document.id,
                    "extracted_text": text
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:

            if document:
                document.delete()

            return Response(
                {
                    "error": "Something went wrong while processing the document.",
                    "details": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class DocumentListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        documents = Document.objects.filter(
            owner=request.user
        )

        serializer = DocumentSerializer(
            documents,
            many=True
        )

        return Response(serializer.data)


class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        question = request.data.get("question")
        document_id = request.data.get("document_id")

        if document_id:
            document_id = int(document_id)

        if not question:
            return Response(
                {
                    "error": "Question is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not document_id:
            return Response(
                {
                    "error": "Please select a document."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether document belongs to logged-in user
        try:
            document = Document.objects.get(
                id=document_id,
                owner=request.user
            )
        except Document.DoesNotExist:
            return Response(
                {
                    "error": "Document not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        results = ask_question(
            question,
            request.user.id,
            document_id
        )

        return Response(
            {
                "question": question,
                "answer": results["answer"],
                "sources": results["sources"]
            },
            status=status.HTTP_200_OK
        )
        
    
class DocumentDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, document_id):

        try:
            document = Document.objects.get(
                id=document_id,
                owner=request.user
            )

        except Document.DoesNotExist:

            return Response(
                {
                    "error": "Document not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ChromaDB se document ke vectors delete karo
        delete_document_from_chromadb(
            document.id
        )

        # PostgreSQL se document delete karo
        document.delete()

        return Response(
            {
                "message": "Document deleted successfully."
            },
            status=status.HTTP_200_OK
        )