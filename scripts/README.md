# Script de População Automática da Base de Dados

Este script cria dados de teste para avaliar a paginação, pesquisa e escalabilidade do sistema SenseHome Technologies.

## 📊 Dados Criados

O script gera as seguintes entidades:

### Quantidades (Script Normal)
- **25 Hubs** - Distribuídos por cidades portuguesas
- **150 Utilizadores** - 6 utilizadores por hub
- **500 Dispositivos** - 20 dispositivos por hub
- **300 Notificações** - 12 notificações por hub
- **7.500 Registros de Histórico** - 15 registros por dispositivo
- **15 Tipos de Dispositivos** - Luzes, sensores, câmaras, etc.
- **10 Divisões** - Sala, cozinha, quarto, etc.

### Quantidades (Script Large)
- **100 Hubs** - Para testes de escalabilidade extrema
- **1.000 Utilizadores** - 10 utilizadores por hub
- **5.000 Dispositivos** - 50 dispositivos por hub
- **2.500 Notificações** - 25 notificações por hub
- **150.000 Registros de Histórico** - 30 registros por dispositivo

### Características dos Dados

#### Hubs
- Nomes realistas baseados em cidades portuguesas
- Flag de descoberta aleatória (0 ou 1)
- IDs únicos UUID

#### Utilizadores
- Emails únicos gerados com Faker.js
- Distribuídos uniformemente pelos hubs
- Todos com role 'Admin'

#### Dispositivos
- Nomes descritivos combinando tipo e divisão
- Códigos de acesso alfanuméricos únicos
- Estados e valores aleatórios realistas
- Distribuição aleatória por tipos e divisões

#### Histórico
- Valores realistas baseados no tipo de dispositivo:
  - Sensores de temperatura: 15-35°C
  - Luzes/Interruptores: 0/1 (ligado/desligado)
  - Qualidade do ar: 0-500 AQI
  - Sensores de movimento: 0/1 (detectado/não detectado)
  - Outros: 0-100% (percentagem genérica)
- Datas distribuídas pelos últimos 90 dias

#### Notificações
- Mensagens realistas do sistema
- Datas distribuídas pelos últimos 30 dias
- Associadas aos respetivos hubs

## 🚀 Execução

### Pré-requisitos
1. Base de dados PostgreSQL configurada
2. Variáveis de ambiente definidas no `.env`
3. Dependências instaladas (`npm install`)

### Comandos

#### Script Normal (Recomendado)
```bash
npm run seed
```

#### Script Large (Para testes de escalabilidade extrema)
```bash
npm run seed:large
```

### Processo de Execução
1. **Teste de Conexão** - Verifica conectividade com a base de dados
2. **Limpeza** - Remove todos os dados existentes
3. **Criação Sequencial**:
   - Tipos de dispositivos
   - Divisões
   - Hubs
   - Utilizadores
   - Dispositivos
   - Notificações
   - Histórico (processado em lotes de 1000)

## 📈 Testes de Escalabilidade

### Paginação

#### Script Normal
- **Hubs**: 3 páginas (10 por página)
- **Dispositivos**: 25 páginas (20 por página)
- **Notificações**: 20 páginas (15 por página)
- **Histórico**: 150 páginas (50 por página)

#### Script Large
- **Hubs**: 10 páginas (10 por página)
- **Dispositivos**: 250 páginas (20 por página)
- **Notificações**: 167 páginas (15 por página)
- **Histórico**: 3000 páginas (50 por página)

### Pesquisa
Os dados incluem:
- Nomes variados para pesquisa textual
- Diferentes tipos e categorias
- Distribuição temporal para filtros por data
- Valores numéricos para filtros de intervalo

### Performance
- **25.000+ registros** para testar consultas complexas
- **Relacionamentos** entre todas as entidades
- **Índices implícitos** nas chaves primárias e estrangeiras

## 🔧 Configuração

### Personalização das Quantidades
Edite as constantes no início do arquivo `seed.js`:

```javascript
const CONFIG = {
    HUBS: 50,                    // Número de hubs
    USERS_PER_HUB: 8,           // Utilizadores por hub
    DEVICES_PER_HUB: 25,        // Dispositivos por hub
    NOTIFICATIONS_PER_HUB: 15,  // Notificações por hub
    HISTORY_RECORDS_PER_DEVICE: 20, // Registros de histórico por dispositivo
    DEVICE_TYPES: 15,           // Tipos de dispositivos
    DIVISIONS: 10               // Divisões
};
```

### Tipos de Dispositivos
O script inclui 15 tipos realistas:
- Smart Light, Temperature Sensor, Motion Detector
- Door Lock, Security Camera, Smart Thermostat
- Smoke Detector, Window Sensor, Smart Switch
- Air Quality Monitor, Smart Plug, Water Leak Sensor
- Smart Doorbell, Garage Door Opener, Smart Speaker

### Divisões da Casa
10 divisões típicas de uma casa:
- Living Room, Kitchen, Bedroom, Bathroom, Office
- Garage, Garden, Basement, Attic, Hallway

## 📋 Saída do Script

### Resumo Final
```
📈 RESUMO DA POPULAÇÃO DA BASE DE DADOS
=====================================
🏢 Hubs: 50
👥 Utilizadores: 400
📱 Tipos de Dispositivos: 15
🏠 Divisões: 10
🔌 Dispositivos: 1250
📢 Notificações: 750
📊 Registros de Histórico: 25000
=====================================

📊 ESTATÍSTICAS PARA TESTES
============================
📄 Páginas de hubs (10 por página): 5
📄 Páginas de dispositivos (20 por página): 63
📄 Páginas de notificações (15 por página): 50
📄 Páginas de histórico (50 por página): 500

🔍 AMOSTRAS DE DADOS CRIADOS
============================
📍 Hub exemplo: "Hub Lisboa 1" (ID: uuid)
🔌 Dispositivo exemplo: "Smart Light Living Room 1" (Código: ABC12345)
📢 Notificação recente: "Dispositivo adicionado com sucesso"
```

## ⚠️ Avisos

1. **Dados Existentes**: O script remove TODOS os dados existentes antes de criar novos
2. **Tempo de Execução**: Pode demorar 1-3 minutos dependendo da performance da base de dados
3. **Memória**: Processa histórico em lotes para evitar problemas de memória
4. **Conexão**: Requer conexão ativa com PostgreSQL

## 🛠️ Resolução de Problemas

### Erro de Conexão
- Verifique as variáveis de ambiente no `.env`
- Confirme que PostgreSQL está a correr
- Teste a conexão manualmente

### Erro de Memória
- Reduza `HISTORY_RECORDS_PER_DEVICE` no CONFIG
- Aumente o `batchSize` na função `seedHistory`

### Erro de Chaves Estrangeiras
- Verifique se todas as tabelas existem
- Execute `sequelize.sync()` antes do script se necessário
