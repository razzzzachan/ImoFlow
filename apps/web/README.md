# ImmoFlow Web (MVP)

## Scripts
- Dev: `npm run dev`
- Build: `npm run build`

## Variáveis de ambiente (Vite)
- `VITE_DEMO` (opcional): ativa modo demo
- `VITE_API_HEALTH_INTERVAL_MS` (opcional): intervalo do health check da API em ms (default 30000)

## Health Banner
- O app verifica `/health` periodicamente e exibe um banner amarelo caso a API esteja offline/instável
- O botão "Fechar" oculta o banner até o fim da sessão (sessionStorage)

## Padrões de UI
- Toasts globais via `ToastProvider`
- Loading componetizado (`<Loading />`)
- Recarregar em listas principais (Bots, Users, Stats)

