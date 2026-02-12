# SleepTracker

Aplicativo móvel minimalista para rastreamento manual de horários de sono com histórico e estatísticas.

## 📱 Funcionalidades

### Tela Principal (Home)
- **Data e hora atual** exibidas em tempo real
- **Status do sono** (dormindo ou acordado)
- **Botão central grande** que alterna entre:
  - "Dormir" → registra horário de início do sono
  - "Acordar" → registra horário de fim do sono e calcula duração
- **Tempo decorrido** exibido quando dormindo
- **Último registro** mostrado em card compacto
- **Feedback háptico** ao tocar botão

### Tela de Histórico
- **Lista cronológica** de todos os registros (mais recente primeiro)
- Formato: "Dormiu HH:MM (DD/MM) — Acordou HH:MM (DD/MM) — Total: Xh Ymin"
- **Excluir registros** com confirmação
- Mensagem quando lista estiver vazia
- Scroll infinito para histórico completo

### Tela de Estatísticas
- **Filtros de período**:
  - Últimas 24h
  - Últimos 3 dias
  - Últimos 7 dias
  - Últimos 30 dias
- **Estatísticas calculadas**:
  - Total de horas dormidas no período
  - Média de horas por dia
  - Número de registros
  - Maior e menor duração de sono
- **Exportar dados em CSV** com compartilhamento via sistema

## 🎨 Design

- **Estilo minimalista** moderno
- **Paleta de cores** neutra com azul suave (#5B8CDB) como destaque
- **Tema claro e escuro** automático (segue preferência do sistema)
- **Tipografia legível** com hierarquia visual clara
- **Ícones simples** e consistentes
- **Animações suaves** de transição

## 🛠️ Tecnologias

- **React Native** 0.81 com **Expo SDK 54**
- **TypeScript** 5.9
- **Expo Router** 6 (navegação baseada em arquivos)
- **NativeWind** 4 (Tailwind CSS para React Native)
- **AsyncStorage** (armazenamento local persistente)
- **Expo Haptics** (feedback tátil)
- **Expo Sharing** (compartilhamento de arquivos)

## 📦 Estrutura do Projeto

```
app/
  (tabs)/
    index.tsx       ← Tela principal (Home)
    history.tsx     ← Tela de histórico
    stats.tsx       ← Tela de estatísticas
    _layout.tsx     ← Configuração de navegação por abas
components/
  screen-container.tsx ← Wrapper para SafeArea
  ui/
    icon-symbol.tsx    ← Mapeamento de ícones
hooks/
  use-sleep-storage.ts ← Hook para gerenciar dados de sono
  use-stats.ts         ← Hook para calcular estatísticas
types/
  sleep.ts            ← Tipos TypeScript
theme.config.js       ← Configuração de cores
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22+
- pnpm 9+
- Expo Go app (iOS/Android) para testar no dispositivo

### Instalação
```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Testar no Dispositivo
1. Instale o app **Expo Go** no seu smartphone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Escaneie o QR code exibido no terminal ou acesse o link Metro

3. O app será carregado no Expo Go

### Testar na Web
```bash
# Abrir no navegador
pnpm dev
# Acesse http://localhost:8081
```

## 📝 Como Usar

1. **Registrar Sono**:
   - Abra o app na tela Home
   - Toque "Dormir" antes de dormir
   - Ao acordar, toque "Acordar"
   - O registro é salvo automaticamente

2. **Ver Histórico**:
   - Navegue até a aba "Histórico"
   - Veja todos os registros anteriores
   - Toque em um registro para expandir opções
   - Toque "Excluir" para remover (com confirmação)

3. **Ver Estatísticas**:
   - Navegue até a aba "Estatísticas"
   - Selecione o período desejado
   - Veja estatísticas calculadas automaticamente
   - Toque "Exportar Dados em CSV" para baixar

4. **Exportar Dados**:
   - Na tela de Estatísticas, toque "Exportar Dados em CSV"
   - Escolha onde salvar ou compartilhar o arquivo
   - Arquivo contém todos os registros em formato CSV

## 💾 Armazenamento de Dados

- **Local**: Todos os dados são armazenados localmente no dispositivo usando AsyncStorage
- **Persistência**: Os dados permanecem salvos mesmo após fechar o app
- **Privacidade**: Nenhum dado é enviado para servidores externos

## 🎯 Arquitetura

O aplicativo segue padrões de desenvolvimento React Native modernos:

- **Hooks personalizados** para lógica de negócio reutilizável
- **TypeScript** para segurança de tipos
- **Componentes funcionais** com React Hooks
- **Armazenamento local** com AsyncStorage
- **Navegação por abas** com Expo Router
- **Estilização** com NativeWind (Tailwind CSS)

## 📄 Licença

Este projeto foi criado como exemplo de aplicativo móvel minimalista.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Algumas ideias para futuras implementações:

- [ ] Widget de tela inicial
- [ ] Edição de registros existentes
- [ ] Filtro personalizado com seletor de datas
- [ ] Gráficos de tendências de sono
- [ ] Notificações de lembrete para dormir
- [ ] Backup em nuvem (opcional)
- [ ] Notas sobre qualidade do sono
- [ ] Integração com Apple Health / Google Fit

---

**Desenvolvido com ❤️ usando React Native + Expo**
