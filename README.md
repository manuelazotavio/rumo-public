# Rumo - Plataforma de turismo e roteiros inteligentes

> Conectando turistas, guias locais e empresas para experiências inesquecíveis.

![Project Status](https://img.shields.io/badge/status-em_desenvolvimento-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📖 Sobre o projeto

O **Rumo** é uma plataforma completa de turismo que visa facilitar a jornada do viajante e potencializar o negócio de guias e empresas locais. O sistema oferece desde a descoberta de atrações (praias, trilhas, gastronomia) até a geração automática de roteiros personalizados e gestão financeira para parceiros.

### ✨ Principais funcionalidades

* **🔍 Busca e filtros inteligentes:** Pesquisa detalhada por categorias como Praias, Trilhas, Cachoeiras, Turismo Náutico, Vida Noturna e mais.
* **🤖 Roteiros automáticos:** Algoritmo que gera sugestões de roteiros baseados no perfil e localização do turista.
* **🔐 Autenticação segura:** Login diferenciado para turistas, empresas e guias com proteção via JWT (HttpOnly Cookies) e criptografia de ponta.
* **💼 Portal do parceiro:**
    * **Guias:** Gestão de agenda, visualização de saldo, solicitações de saque e histórico de transações.
    * **Empresas:** Gestão de atrações, eventos e promoções.
* **🛡️ Segurança:** Validação de dados rigorosa (Zod) e proteção contra vulnerabilidades comuns (XSS, Injection).

## 🚀 Tecnologias utilizadas

O projeto foi desenvolvido utilizando uma stack moderna e robusta:

### Back-end
* ![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) **Node.js & Express**
* ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) **Prisma ORM**
* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL**
* **Segurança:** BCrypt, JSON Web Token (JWT), Zod.

### Front-end
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js**
* ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**
* **Bibliotecas:** React Router DOM, React Icons.

## 📝 Licença
#### Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.