# auth.augment.md

## Objetivo
Gerenciar autenticação de usuários e controle de acesso por tipo de perfil.

## Entidades
- Usuário: nome, e-mail, telefone, senha criptografada, tipo (admin, corretor, gestor)

## Funcionalidades
- Cadastro com confirmação por e-mail/WhatsApp
- Login com sessão persistente
- Recuperação de senha
- Gestão de perfis: corretor, dono da imobiliária, atendente
- Tela de login e dashboard por tipo de perfil

## Tarefas
- [ ] Implementar backend com autenticação JWT
- [ ] Criar endpoints: /login, /signup, /recover-password
- [ ] Definir middleware para proteção de rotas por tipo de usuário
- [ ] Criar UI: login, cadastro, recuperar senha

## Conexões
- CRM: associa usuários aos leads
- Admin: cria novos usuários manualmente ou por convite
