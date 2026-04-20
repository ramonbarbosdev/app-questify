# Nivra

Nivra é um aplicativo mobile de desafio diário focado em estimular o raciocínio lógico de forma simples, rápida e intuitiva.

A proposta é oferecer uma experiência minimalista onde o usuário resolve um único desafio por dia, com um fluxo direto e sem distrações.

## Conceito

* Um desafio por dia
* Tempo de execução curto (1 a 3 minutos)
* Interface simples e objetiva
* Foco em clareza e experiência do usuário

O objetivo não é ser um jogo complexo, mas sim um hábito diário de estímulo mental.

## Funcionalidades

* Exibição de desafio diário
* Sistema de tentativas
* Feedback de acerto e erro
* Resultado visual ao final
* Histórico de desempenho

## Tecnologias

* React Native (Expo)
* TypeScript
* StyleSheet (UI nativa)
* Backend (em evolução): Java com Spring Boot

## Estrutura

* Home: exibição do desafio
* Result: resultado da tentativa
* History: histórico de dias anteriores

## Objetivo do projeto

Este projeto foi desenvolvido com foco em:

* Criação de um produto mobile simples e eficiente
* Experiência do usuário com interface limpa e intuitiva
* Arquitetura escalável e organizada
* Aplicação de conceitos de produto e retenção de usuário


##  Build Remoto (EAS) -  Android 

- Essa é a preparação para o build do projeto no Android

1. Variaveis de Ambiente 

Criar variável no EAS

```bash
  eas env:create
```

Para atualizar 

```bash
  npx eas env:update
```

Preencha (caso seja preview):

 - Nome: EXPO_PUBLIC_API_URL

 - Valor: https://api-homolog.seudominio.com

 - Visibilidade: Plain text

 - Instruçao: Use a tecla espaço para marcar o ambiente.

      ```bash
      ◉ preview
      ◯ development
      ◯ production
      ```

Repita o processo para production, se necessário.


## Status

Em Produção

## Autor

Ramon Barbosa
