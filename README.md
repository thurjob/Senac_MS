Projeto_Senac (BuildPro) — Plataforma de Conexão entre Clientes e Prestadores de Serviço
📘 Sobre o Projeto

Este projeto foi desenvolvido por nossa equipe como parte do curso de Desenvolvimento de Sistemas no Senac Hub Academy.
Chamamos a plataforma de BuildPro, e seu objetivo é facilitar a conexão entre clientes e prestadores de serviços da área da construção civil, como pedreiros, eletricistas, encanadores, pintores e outros profissionais.

Na versão original, os dados eram armazenados no navegador por meio do localStorage, utilizando um mock database em assets/js/db.js. Pensando na evolução do projeto para um ambiente profissional, estruturamos também um banco de dados relacional completo, permitindo futura integração com um backend real.

🎯 Objetivos do Projeto

Desenvolver uma interface moderna, responsiva e intuitiva.

Permitir cadastro e login tanto de clientes quanto de prestadores.

Listar prestadores com filtros por categoria, localização e avaliação.

Criar e gerenciar solicitações de serviços (requests).

Implementar um sistema simples de troca de mensagens.

Preparar a arquitetura do projeto para integração futura com APIs reais.

🗄️ Banco de Dados

Como parte da profissionalização do projeto, criamos um esquema SQL completo, equivalente à estrutura que antes existia apenas no localStorage.

O banco contém três tabelas principais:

1. users

Armazena informações de clientes e prestadores.

2. requests

Registra solicitações de serviço feitas pelos clientes e aceitas pelos prestadores.

3. messages

Guarda o histórico de mensagens entre as partes envolvidas em cada solicitação.

Também disponibilizamos:

Arquivo do esquema SQL

Inserts de exemplo

Diagrama ER (DER)

README técnico detalhado


▶️ Como importar (SQLite)
sqlite3 buildpro.db < projeto_senac_schema.sql


Para MySQL/Postgres, basta adaptar os tipos (VARCHAR, DATETIME, NUMERIC) e executar os mesmos arquivos.

⚙️ Lógica do Sistema (Resumo)

Usuários podem se cadastrar como CLIENT ou PROVIDER.

Clientes criam solicitações (requests).

Prestadores podem aceitar solicitações abertas.

Cada solicitação possui seu próprio chat interno.

Todas as mensagens são vinculadas a um request.

🌐 API (Planejamento para o Backend)

Para futuras integrações, sugerimos a seguinte estrutura de endpoints:

POST /api/auth/login

POST /api/auth/register

GET /api/providers

POST /api/requests

GET /api/requests/:id

POST /api/requests/:id/accept

POST /api/requests/:id/messages

GET /api/requests/:id/messages

Autenticação sugerida: JWT
Segurança recomendada: bcrypt para senhas

🔒 Observações Importantes

No mock, algumas senhas aparecem em texto puro — isso é apenas para fins educacionais.

No banco real, utilizamos hash.

IDs podem usar UUID ou autoincremento, dependendo do SGDB usado.

📞 Continuidade do Projeto

Como equipe, planejamos:

Migrar totalmente do localStorage para backend real

Criar uma API REST completa

Implementar melhor fluxo de contratação e finalização de serviços

Adicionar sistema de avaliações e notificações

E se precisarmos expandir o banco, adicionar novas entidades ou criar endpoints específicos, o projeto já está estruturado para isso.