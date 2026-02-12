# SleepTracker - TODO

## Funcionalidades Principais

- [x] Configurar navegação com 3 abas (Home, Histórico, Estatísticas)
- [x] Gerar e configurar logo personalizado do aplicativo
- [x] Atualizar paleta de cores no theme.config.js
- [x] Criar tipos TypeScript para registros de sono
- [x] Implementar armazenamento local com AsyncStorage
- [x] Criar hook useStorage para gerenciar dados persistentes

## Tela Principal (Home)

- [x] Exibir data e hora atual em tempo real
- [x] Mostrar status atual (dormindo/acordado)
- [x] Botão central grande que alterna entre "Dormir" e "Acordar"
- [x] Registrar horário de início ao tocar "Dormir"
- [x] Registrar horário de fim ao tocar "Acordar"
- [x] Calcular e exibir duração do sono
- [x] Mostrar tempo decorrido quando dormindo
- [x] Exibir card com último registro de sono
- [x] Adicionar feedback háptico ao tocar botão
- [x] Animação suave de transição de estado

## Tela de Histórico

- [x] Lista cronológica de registros (mais recente primeiro)
- [x] Exibir formato: "Dormiu HH:MM (DD/MM) — Acordou HH:MM (DD/MM) — Total: Xh Ymin"
- [x] Implementar scroll para histórico completo
- [x] Mensagem quando lista estiver vazia
- [ ] Opção de editar registro
- [x] Opção de excluir registro com confirmação
- [x] Atualização em tempo real ao adicionar novos registros

## Tela de Estatísticas

- [x] Seletor de período (24h, 3 dias, 7 dias, 30 dias, personalizado)
- [x] Calcular total de horas dormidas no período
- [x] Calcular média de horas por dia
- [x] Mostrar número de registros no período
- [x] Exibir maior e menor duração de sono
- [ ] Implementar filtro personalizado com seletor de datas
- [x] Botão de exportar dados em CSV
- [x] Gerar arquivo CSV com todos os registros
- [x] Compartilhar arquivo CSV via sistema

## Design e Tema

- [x] Implementar tema claro e escuro automático
- [x] Aplicar paleta de cores minimalista
- [x] Adicionar animações suaves de transição entre abas
- [x] Garantir tipografia legível e hierarquia visual
- [x] Ícones simples e consistentes

## Extras

- [ ] Validação de dados ao editar registros
- [ ] Tratamento de erros ao salvar/carregar dados
- [ ] Testes de funcionalidades principais
- [ ] Documentação de uso no README
