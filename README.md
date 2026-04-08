# Roleta Eden

Projeto com:

- `Entrada de Uso`: tela simples para girar a roleta e mostrar o brinde.
- `Entrada Administrativa`: painel com login para editar itens, cores, tamanho e acesso.

## Rodar localmente

No PowerShell, prefira:

```powershell
npm.cmd install
npm.cmd start
```

Depois abra:

```text
http://localhost:3000
```

Ou execute:

```text
iniciar-roleta.bat
```

## Login padrao

```text
usuario: admin
senha: 1234
```

## Arquivos importantes

- `data/credenciais.txt`: guarda login e senha.
- `data/roleta-config.json`: guarda a configuracao da roleta.

## Publicar gratis na Render

1. Crie uma conta no GitHub.
2. Envie esta pasta para um repositorio no GitHub.
3. Crie conta na Render.
4. Clique em `New +` e depois `Blueprint`.
5. Escolha o repositorio deste projeto.
6. A Render vai ler o arquivo `render.yaml` automaticamente.
7. Aguarde o deploy terminar e abra a URL gerada.

## Importante sobre a Render gratuita

No plano gratis da Render, os arquivos salvos localmente podem ser perdidos quando o servico reinicia ou faz novo deploy. Isso afeta:

- `data/credenciais.txt`
- `data/roleta-config.json`

Ou seja: funciona para demonstracao e testes, mas as alteracoes do painel administrativo podem nao ficar permanentes.

Se quiser persistencia real gratis, o proximo passo ideal e adaptar o projeto para usar Supabase ou Firebase.
