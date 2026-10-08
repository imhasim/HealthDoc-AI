from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
import ollama


def extract_text_from_pdf(file):
    reader = PdfReader(file)

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text
    
    
def split_text_into_chunks(text):
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500,
        chunk_overlap = 50
    )
    
    chunk = splitter.split_text(text)
    
    return chunk


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embedding(text):
    embedding = embedding_model.encode(text)
    return embedding




chroma_client = chromadb.PersistentClient(
    path = './chroma_db'
)

collection = chroma_client.get_or_create_collection(
    name = 'health_documents'
)

def store_chunk_in_chromadb(chunk_id, text, embedding, document_id, owner_id):
    collection.add(
        ids=[chunk_id],
        documents=[text],
        embeddings=[embedding],
        metadatas=[{
            "document_id": document_id,
            "owner_id": owner_id
        }]
    )
    
    

def search_similar_chunks(question, owner_id, document_id, top_k=3):
    
    question_embedding = create_embedding(question)
    
    results = collection.query(
    query_embeddings=[question_embedding.tolist()],
    n_results=top_k,
    where={
        "$and": [
            {"owner_id": owner_id},
            {"document_id": document_id}
        ]
    }
)
    return results

def create_context(question,owner_id, top_k = 3):
    
    results = search_similar_chunks(question,owner_id, top_k)
    
    documents = results["documents"][0]
    
    context  = "\n\n".join(documents)
    
    return context    
    
    
    
def ask_llm(question, context):

    prompt = f"""
You are a healthcare document assistant.

Answer the user's question using ONLY the information provided in the context.

Important rules:
1. Do not invent or change any values from the report.
2. Preserve medical values exactly as written in the context.
3. If a value has a reference range, report the value and the reference range separately.
4. Do not decide whether a medical value is normal or abnormal unless the context explicitly says so.
5. If the answer is not present in the context, say:
   "I could not find this information in the uploaded document."
6. Do not use outside medical information.

Context:
{context}

Question:
{question}

Answer:
"""

    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]

def ask_question(question, owner_id, document_id):
    # context = create_context(question,owner_id)
    results = search_similar_chunks(
    question,
    owner_id,
    document_id
)
    
    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    
    sources = []
    
    for document, metadata in zip(documents, metadatas):
        sources.append({
            "document_id":metadata["document_id"],
            "content":document
        })
    
    context = "\n\n".join(documents)
    
    answer = ask_llm(question,context)
    
    return {
        "answer":answer,
        "sources":sources
    }


def delete_document_from_chromadb(document_id):
    collection.delete(
        where={
            "document_id": document_id
        }
    )