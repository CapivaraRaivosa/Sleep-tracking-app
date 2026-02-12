# SleepTracker - Design de Interface

## Visão Geral
Aplicativo minimalista para rastreamento manual de sono com foco em simplicidade e usabilidade em orientação portrait (9:16) para uso com uma mão.

## Paleta de Cores
- **Primária**: Azul suave (#5B8CDB) - cor de destaque para botões e elementos interativos
- **Background (Claro)**: Branco (#FFFFFF)
- **Background (Escuro)**: Preto suave (#0F0F0F)
- **Surface (Claro)**: Cinza muito claro (#F8F9FA)
- **Surface (Escuro)**: Cinza escuro (#1A1A1A)
- **Texto (Claro)**: Preto (#11181C)
- **Texto (Escuro)**: Branco suave (#ECEDEE)
- **Muted (Claro)**: Cinza médio (#687076)
- **Muted (Escuro)**: Cinza claro (#9BA1A6)
- **Border (Claro)**: Cinza claro (#E5E7EB)
- **Border (Escuro)**: Cinza escuro (#334155)

## Lista de Telas

### 1. Tela Principal (Home)
**Conteúdo:**
- Data e hora atual exibidas no topo
- Status atual do sono (dormindo ou acordado)
- Botão central grande e circular que alterna entre:
  - "Dormir" (ícone de lua) - quando acordado
  - "Acordar" (ícone de sol) - quando dormindo
- Se estiver dormindo, mostrar tempo decorrido desde o início
- Card compacto mostrando último registro de sono

**Funcionalidade:**
- Ao tocar "Dormir": registra horário de início e muda estado
- Ao tocar "Acordar": registra horário de fim, calcula duração, salva registro
- Feedback háptico ao tocar botão
- Animação suave de transição de estado

### 2. Tela de Histórico
**Conteúdo:**
- Lista cronológica (mais recente primeiro) de registros de sono
- Cada item mostra:
  - Data do registro
  - Horário de início e fim
  - Duração total formatada (ex: "8h 30min")
  - Ícone de ações (editar/excluir)
- Mensagem de lista vazia se não houver registros

**Funcionalidade:**
- Scroll infinito para histórico completo
- Tocar item abre opções de editar/excluir
- Confirmação antes de excluir
- Atualização em tempo real ao adicionar novos registros

### 3. Tela de Estatísticas
**Conteúdo:**
- Seletor de período no topo:
  - Últimas 24h
  - Últimos 3 dias
  - Últimos 7 dias
  - Últimos 30 dias
  - Personalizado (seletor de datas)
- Cards com estatísticas:
  - Total de horas dormidas no período
  - Média de horas por dia
  - Número de registros no período
  - Maior e menor duração de sono
- Botão de exportar dados em CSV

**Funcionalidade:**
- Filtros aplicam cálculos em tempo real
- Exportação gera arquivo CSV com todos os registros
- Feedback visual ao trocar período

## Fluxos Principais de Usuário

### Fluxo 1: Registrar Sono
1. Usuário abre app na tela Home
2. Vê data/hora atual e botão "Dormir"
3. Toca botão "Dormir" antes de dormir
4. App registra horário de início, muda botão para "Acordar"
5. Mostra tempo decorrido desde início
6. Ao acordar, usuário toca "Acordar"
7. App registra horário de fim, calcula duração, salva registro
8. Mostra resumo do sono registrado
9. Botão volta para estado "Dormir"

### Fluxo 2: Ver Histórico
1. Usuário toca aba "Histórico"
2. Vê lista de todos os registros anteriores
3. Pode rolar para ver registros mais antigos
4. Toca em registro para ver opções
5. Pode editar horários ou excluir registro

### Fluxo 3: Ver Estatísticas
1. Usuário toca aba "Estatísticas"
2. Vê estatísticas dos últimos 7 dias (padrão)
3. Toca seletor de período para mudar filtro
4. Estatísticas atualizam automaticamente
5. Pode tocar "Exportar CSV" para baixar dados

### Fluxo 4: Editar Registro
1. Na tela de Histórico, toca registro
2. Abre modal de edição
3. Pode ajustar horário de início e fim
4. Toca "Salvar" para confirmar
5. Registro atualizado na lista

### Fluxo 5: Exportar Dados
1. Na tela de Estatísticas, toca "Exportar CSV"
2. App gera arquivo CSV com todos os registros
3. Abre compartilhamento do sistema
4. Usuário pode salvar ou enviar arquivo

## Princípios de Design

1. **Minimalismo**: Apenas elementos essenciais, sem distrações
2. **Tipografia Legível**: Fontes grandes e claras, hierarquia visual clara
3. **Feedback Imediato**: Toda ação tem resposta visual/háptica
4. **Consistência iOS**: Seguir Apple HIG para navegação e interações
5. **Acessibilidade**: Contraste adequado, áreas de toque grandes (mínimo 44x44pt)
6. **Animações Sutis**: Transições suaves entre estados, sem exageros
7. **Tema Automático**: Respeitar preferência do sistema (claro/escuro)
