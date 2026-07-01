import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# --- 1. CONFIGURAÇÃO DO SERVIDOR ---
app = Flask(__name__)
CORS(app)  # Permite a comunicação direta com o React

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')

# --- 2. INICIALIZAÇÃO DA IA E CONFIGURAÇÃO DO TEMPLATE ---

# Caminho absoluto para o arquivo de texto com o seu prompt robusto
PROMPT_FILE_PATH = os.path.join(os.path.dirname(__file__), "contexto_echo.txt")

# Configura o modelo do Gemini (Temperatura baixa = máxima obediência às regras)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash", 
    temperature=0.1,
    api_key=GOOGLE_API_KEY
)

# Criando o prompt estruturado que injeta o arquivo .txt dinamicamente
prompt_sistema = ChatPromptTemplate.from_messages([
    ("system", "{contexto_sistema}"),
    ("human", "{question}")
])

# Cria a corrente de execução (Chain) do LangChain
chain = prompt_sistema | llm | StrOutputParser()

# --- 3. ROTAS DO SERVIDOR ---
@app.route("/ask", methods=['POST'])
def ask_chatbot():
    data = request.get_json()
    
    # Validação básica de entrada
    if not data or 'question' not in data:
        return jsonify({"error": "Pergunta vazia"}), 400
        
    try:
        # 1. Recarrega o arquivo de texto a cada requisição (Evita problemas de cache)
        with open(PROMPT_FILE_PATH, "r", encoding="utf-8") as file:
            conteudo_prompt = file.read()
        
        # Log de debug no terminal do Python
        print(f"\n[DEBUG] Usuário perguntou: {data['question']}")
        
        # 2. Executa a inteligência injetando o prompt robusto e a pergunta atual
        answer = chain.invoke({
            "contexto_sistema": conteudo_prompt,
            "question": data['question']
        })
        
        # Log da resposta gerada
        print(f"[DEBUG] Resposta da ECO: {answer}")
        
        return jsonify({"answer": answer})

    except FileNotFoundError:
        print("❌ Erro Crítico: O arquivo 'contexto_echo.txt' sumiu da pasta do agente.")
        return jsonify({"error": "Configuração do sistema ausente no servidor"}), 500
    except Exception as e:
        print(f"❌ Erro crítico no processamento: {e}")
        return jsonify({"error": "Erro interno ao processar sua pergunta"}), 500

if __name__ == '__main__':
    # Inicializa o servidor Flask na porta 5000 com recarregamento automático ativo
    app.run(debug=True, port=5000)