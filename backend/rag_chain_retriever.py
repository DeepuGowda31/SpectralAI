import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain_core.messages import HumanMessage, AIMessage
import sys

# Load environment variables
load_dotenv()

# Check required environment variables
required_env_vars = ["OPENAI_API_KEY", "GOOGLE_API_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

def load_documents(pdf_path):
    """Load documents from PDF file."""
    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found at {pdf_path}")
            
        loader = PyPDFLoader(pdf_path)
        docs = loader.load()
        if not docs:
            raise ValueError("No documents loaded from PDF")
        return docs
    except Exception as e:
        print(f"Error loading PDF: {e}")
        raise

def split_documents(docs, chunk_size=1000, chunk_overlap=20):
    """Split documents into chunks."""
    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )
        splits = text_splitter.split_documents(docs)
        if not splits:
            raise ValueError("No text chunks created from documents")
        return splits
    except Exception as e:
        print(f"Error splitting documents: {e}")
        raise

def create_vector_store(docs):
    """Create FAISS vector store from documents."""
    try:
        embeddings = OpenAIEmbeddings()
        db = FAISS.from_documents(docs, embeddings)
        return db
    except Exception as e:
        print(f"Error creating vector store: {e}")
        raise

def setup_conversational_rag(db):
    """Set up the conversational RAG chain with Gemini AI."""
    try:
        # Initialize Gemini AI
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",  # Changed from gemini-2.0-flash as it might not be available
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.5
        )

        # Create memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key='answer'
        )

        # Create prompt template
        prompt = ChatPromptTemplate.from_template("""
        You are designed to explain medical reports in simple terms. I can break down complex medical jargon and clarify findings from your reports. Please remember, I'm an AI and cannot offer medical advice, diagnoses, or treatment. Always consult your doctor for any health concerns.
        
        Chat History:
        {chat_history}
        
        Context:
        {context}
        
        Human: {question}
        Assistant: """)

        # Create conversational chain
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=db.as_retriever(),
            memory=memory,
            combine_docs_chain_kwargs={"prompt": prompt},
            return_source_documents=True,
            return_generated_question=True
        )

        return qa_chain
    except Exception as e:
        print(f"Error setting up conversational RAG chain: {e}")
        raise

def chat_interface(qa_chain):
    """Interactive chat interface."""
    print("\nWelcome to the Medical Report Assistant!")
    print("Type 'exit' to end the conversation.")
    print("Type 'clear' to clear the conversation history.")
    print("-" * 50)

    while True:
        try:
            # Get user input
            user_input = input("\nYou: ").strip()
            
            # Check for exit command
            if user_input.lower() == 'exit':
                print("\nThank you for using the Medical Report Assistant. Goodbye!")
                break
            
            # Check for clear command
            if user_input.lower() == 'clear':
                qa_chain.memory.clear()
                print("\nConversation history cleared.")
                continue
            
            # Process the query
            response = qa_chain({"question": user_input})
            
            # Print the response
            print("\nAssistant:", response['answer'])
            
            # Optionally show source documents
            if response.get('source_documents'):
                print("\nSources:")
                for i, doc in enumerate(response['source_documents'], 1):
                    print(f"\nSource {i}:")
                    print(doc.page_content[:200] + "...")

        except KeyboardInterrupt:
            print("\n\nExiting...")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            continue

def main():
    # Load and process documents
    pdf_path = "diagnostic-report.pdf"
    docs = load_documents(pdf_path)
    if not docs:
        return

    # Split documents
    split_docs = split_documents(docs)
    
    # Create vector store
    db = create_vector_store(split_docs)
    if not db:
        return

    # Setup conversational RAG chain
    qa_chain = setup_conversational_rag(db)
    if not qa_chain:
        return

    # Start chat interface
    chat_interface(qa_chain)

if __name__ == "__main__":
    main() 