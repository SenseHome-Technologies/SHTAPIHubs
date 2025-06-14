#!/usr/bin/env node
'use strict';

/**
 * Script de População Automática da Base de Dados - VERSÃO GRANDE
 * 
 * Este script cria uma grande quantidade de dados para testar:
 * - Escalabilidade extrema do sistema
 * - Performance com grandes volumes de dados
 * - Paginação com muitas páginas
 * 
 * Execução: node scripts/seed-large.js
 */

require('dotenv').config();
const DatabaseSeeder = require('./seed');

// Override configuration for large dataset
const LARGE_CONFIG = {
    HUBS: 100,                   // 100 hubs
    USERS_PER_HUB: 10,          // 10 usuários por hub (1000 usuários total)
    DEVICES_PER_HUB: 50,        // 50 dispositivos por hub (5000 dispositivos total)
    NOTIFICATIONS_PER_HUB: 25,  // 25 notificações por hub (2500 notificações total)
    HISTORY_RECORDS_PER_DEVICE: 30, // 30 registros de histórico por dispositivo (150000 registros total)
    DEVICE_TYPES: 15,           // 15 tipos de dispositivos
    DIVISIONS: 10               // 10 divisões
};

class LargeDatabaseSeeder extends DatabaseSeeder {
    constructor() {
        super();
        // Override the CONFIG with large values
        Object.assign(global.CONFIG || {}, LARGE_CONFIG);
    }

    async run() {
        console.log('🚀 INICIANDO POPULAÇÃO GRANDE DA BASE DE DADOS');
        console.log('===============================================');
        console.log(`📊 Dados a criar:`);
        console.log(`   🏢 Hubs: ${LARGE_CONFIG.HUBS}`);
        console.log(`   👥 Utilizadores: ${LARGE_CONFIG.HUBS * LARGE_CONFIG.USERS_PER_HUB}`);
        console.log(`   🔌 Dispositivos: ${LARGE_CONFIG.HUBS * LARGE_CONFIG.DEVICES_PER_HUB}`);
        console.log(`   📢 Notificações: ${LARGE_CONFIG.HUBS * LARGE_CONFIG.NOTIFICATIONS_PER_HUB}`);
        console.log(`   📊 Histórico: ${LARGE_CONFIG.HUBS * LARGE_CONFIG.DEVICES_PER_HUB * LARGE_CONFIG.HISTORY_RECORDS_PER_DEVICE}`);
        console.log('===============================================\n');
        
        const startTime = Date.now();
        
        try {
            await super.run();
            
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000;
            
            console.log('\n⏱️  ESTATÍSTICAS DE PERFORMANCE');
            console.log('===============================');
            console.log(`🕐 Tempo total: ${duration.toFixed(2)} segundos`);
            console.log(`📈 Registros por segundo: ${Math.round((LARGE_CONFIG.HUBS * LARGE_CONFIG.DEVICES_PER_HUB * LARGE_CONFIG.HISTORY_RECORDS_PER_DEVICE) / duration)}`);
            console.log('===============================');
            
        } catch (error) {
            console.error('❌ Erro na população grande:', error);
            throw error;
        }
    }
}

// Execute the large seeder
async function main() {
    const seeder = new LargeDatabaseSeeder();
    await seeder.run();
}

// Handle errors and exit
main().catch((error) => {
    console.error('❌ Erro fatal na população grande:', error);
    process.exit(1);
});
