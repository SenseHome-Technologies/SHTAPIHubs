#!/usr/bin/env node
'use strict';

/**
 * Script de População Automática da Base de Dados
 * 
 * Este script cria entidades em número e forma que permite avaliar:
 * - Paginação de entidades
 * - Pesquisa de entidades
 * - Escalabilidade do modelo de dados
 * 
 * Execução: npm run seed
 */

require('dotenv').config();
const { faker } = require('@faker-js/faker');

// Import models
const sequelize = require('../src/framework/db/postgresql/config');
const Hub = require('../src/framework/db/postgresql/hubModel');
const User = require('../src/framework/db/postgresql/userModel');
const Device = require('../src/framework/db/postgresql/deviceModel');
const DeviceType = require('../src/framework/db/postgresql/deviceTypeModel');
const Division = require('../src/framework/db/postgresql/divisionModel');
const Notification = require('../src/framework/db/postgresql/notificationModel');
const History = require('../src/framework/db/postgresql/historyModel');

// Configuration for data generation
const CONFIG = {
    HUBS: 25,                    // 25 hubs para testar escalabilidade
    USERS_PER_HUB: 6,           // 6 usuários por hub (150 usuários total)
    DEVICES_PER_HUB: 20,        // 20 dispositivos por hub (500 dispositivos total)
    NOTIFICATIONS_PER_HUB: 12,  // 12 notificações por hub (300 notificações total)
    HISTORY_RECORDS_PER_DEVICE: 15, // 15 registros de histórico por dispositivo (7500 registros total)
    DEVICE_TYPES: 20,           // 20 tipos de dispositivos
    DIVISIONS: 15               // 15 divisões
};

// Device types data
const DEVICE_TYPES = [
    { name: 'Luz LED', icon: '💡' },
    { name: 'Sensor de Temperatura', icon: '🌡️' },
    { name: 'Sensor de Humidade', icon: '💧' },
    { name: 'Tomada Inteligente', icon: '🔌' },
    { name: 'Câmera de Segurança', icon: '📹' },
    { name: 'Sensor de Movimento', icon: '🚶' },
    { name: 'Termostato', icon: '🎛️' },
    { name: 'Fechadura Inteligente', icon: '🔐' },
    { name: 'Sensor de Fumo', icon: '🚨' },
    { name: 'Alto-falante Inteligente', icon: '🔊' },
    { name: 'Sensor de Porta/Janela', icon: '🚪' },
    { name: 'Dimmer', icon: '🔆' },
    { name: 'Ventilador Inteligente', icon: '🌀' },
    { name: 'Sensor de Qualidade do Ar', icon: '🌬️' },
    { name: 'Irrigador Automático', icon: '🌱' },
    { name: 'Persiana Automática', icon: '🪟' },
    { name: 'Sensor de Presença', icon: '👁️' },
    { name: 'Medidor de Energia', icon: '⚡' },
    { name: 'Válvula de Água', icon: '🚰' },
    { name: 'Sensor de Vibração', icon: '📳' }
];

// Divisions data
const DIVISIONS = [
    { name: 'Sala de Estar', icon: '🛋️' },
    { name: 'Cozinha', icon: '🍳' },
    { name: 'Quarto Principal', icon: '🛏️' },
    { name: 'Casa de Banho', icon: '🚿' },
    { name: 'Escritório', icon: '💼' },
    { name: 'Garagem', icon: '🚗' },
    { name: 'Jardim', icon: '🌳' },
    { name: 'Cave', icon: '🏠' },
    { name: 'Sótão', icon: '🏚️' },
    { name: 'Corredor', icon: '🚪' },
    { name: 'Quarto de Hóspedes', icon: '🛌' },
    { name: 'Lavandaria', icon: '🧺' },
    { name: 'Despensa', icon: '📦' },
    { name: 'Varanda', icon: '🌅' },
    { name: 'Terraço', icon: '🏖️' }
];

// Utility functions
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

// Portuguese cities for realistic hub names
const PORTUGUESE_CITIES = [
    'Lisboa', 'Porto', 'Braga', 'Coimbra', 'Aveiro', 'Faro', 'Setúbal', 'Évora',
    'Viseu', 'Leiria', 'Santarém', 'Beja', 'Castelo Branco', 'Guarda', 'Viana do Castelo',
    'Vila Real', 'Bragança', 'Portalegre', 'Funchal', 'Angra do Heroísmo'
];

class DatabaseSeeder {
    constructor() {
        this.deviceTypes = [];
        this.divisions = [];
        this.hubs = [];
        this.users = [];
        this.devices = [];
    }

    async run() {
        try {
            console.log('🌱 Iniciando população da base de dados...\n');

            // Test database connection
            await this.testConnection();

            // Clear existing data
            await this.clearDatabase();

            // Seed data in order (respecting foreign key constraints)
            await this.seedDeviceTypes();
            await this.seedHubs();
            await this.seedDivisions();
            await this.seedUsers();
            await this.seedDevices();
            await this.seedNotifications();
            await this.seedHistory();

            // Display summary
            await this.displaySummary();

            console.log('\n✅ População da base de dados concluída com sucesso!');
            console.log('📊 Dados criados para testar paginação, pesquisa e escalabilidade.');

        } catch (error) {
            console.error('❌ Erro durante a população da base de dados:', error);
            throw error;
        } finally {
            await sequelize.close();
        }
    }

    async testConnection() {
        console.log('🔌 Testando conexão com a base de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida com sucesso.\n');
    }

    async clearDatabase() {
        console.log('🧹 Limpando dados existentes...');

        // Delete in reverse order of dependencies
        await History.destroy({ where: {}, truncate: true, cascade: true });
        await Notification.destroy({ where: {}, truncate: true, cascade: true });
        await Device.destroy({ where: {}, truncate: true, cascade: true });
        await User.destroy({ where: {}, truncate: true, cascade: true });
        await Hub.destroy({ where: {}, truncate: true, cascade: true });
        await Division.destroy({ where: {}, truncate: true, cascade: true });
        await DeviceType.destroy({ where: {}, truncate: true, cascade: true });

        console.log('✅ Dados existentes removidos.\n');
    }

    async seedDeviceTypes() {
        console.log('📱 Criando tipos de dispositivos...');

        this.deviceTypes = await DeviceType.bulkCreate(DEVICE_TYPES);

        console.log(`✅ ${this.deviceTypes.length} tipos de dispositivos criados.\n`);
    }

    async seedDivisions() {
        console.log('🏠 Criando divisões...');

        this.divisions = [];
        const divisionsData = [];

        // Create divisions for each hub
        for (const hub of this.hubs) {
            for (const divisionTemplate of DIVISIONS) {
                divisionsData.push({
                    name: divisionTemplate.name,
                    icon: divisionTemplate.icon,
                    hubid: hub.id
                });
            }
        }

        this.divisions = await Division.bulkCreate(divisionsData);

        console.log(`✅ ${this.divisions.length} divisões criadas (${DIVISIONS.length} por hub).\n`);
    }

    async seedHubs() {
        console.log('🏢 Criando hubs...');

        this.hubs = [];
        for (let i = 0; i < CONFIG.HUBS; i++) {
            const city = getRandomElement(PORTUGUESE_CITIES);
            const hubName = `Hub ${city} ${i + 1}`;
            const latitude = getRandomFloat(37.0, 41.0);
            const longitude = getRandomFloat(-9.0, -6.0);

            const hub = await Hub.create({
                name: hubName,
                discoveryflag: getRandomInt(0, 1),
                role: 'Hub',
                latitude,
                longitude
            });

            this.hubs.push(hub);
        }

        const testHub = await Hub.create({
            name: "Hub Test",
            discoveryflag: 0,
            role: 'Hub',
            latitude: getRandomFloat(37.0, 41.0),
            longitude: getRandomFloat(-9.0, -6.0)
        });

        this.hubs.push(testHub);

        console.log(`✅ ${this.hubs.length} hubs criados.\n`);
    }

    async seedUsers() {
        console.log('👥 Criando utilizadores...');

        const usersData = [];
        for (const hub of this.hubs) {
            for (let i = 0; i < CONFIG.USERS_PER_HUB; i++) {
                const firstName = faker.person.firstName();
                const lastName = faker.person.lastName();
                const email = faker.internet.email({ firstName, lastName }).toLowerCase();

                usersData.push({
                    email: email,
                    hubid: hub.id,
                    role: 'Admin'
                });
            }
        }

        usersData.push({
            email: 'tiagooliveira869@gmail.com',
            hubid: this.hubs[0].id,
            role: 'Admin'
        })

        this.users = await User.bulkCreate(usersData);

        console.log(`✅ ${this.users.length} utilizadores criados.\n`);
    }

    async seedDevices() {
        console.log('🔌 Criando dispositivos...');

        this.devices = [];
        let deviceCount = 0;

        for (const hub of this.hubs) {
            // Get divisions for this specific hub
            const hubDivisions = this.divisions.filter(div => div.hubid === hub.id);

            for (let i = 0; i < CONFIG.DEVICES_PER_HUB; i++) {
                const deviceType = getRandomElement(this.deviceTypes);
                const division = getRandomElement(hubDivisions);
                const deviceName = `${deviceType.name} ${division.name} ${i + 1}`;

                try {
                    const device = await Device.create({
                        name: deviceName,
                        accesscode: faker.string.alphanumeric(8).toUpperCase(),
                        state: getRandomInt(0, 1),
                        favorite: getRandomInt(0, 1),
                        value: getRandomFloat(0, 100),
                        type: deviceType.id,
                        hubid: hub.id,
                        divisionid: division.id
                    });

                    this.devices.push(device);
                    deviceCount++;

                    if (deviceCount % 10 === 0) {
                        console.log(`   Criados ${deviceCount} dispositivos...`);
                    }
                } catch (error) {
                    console.error(`Erro ao criar dispositivo ${deviceName}:`, error.message);
                }
            }
        }

        console.log(`✅ ${this.devices.length} dispositivos criados.\n`);
    }

    async seedNotifications() {
        console.log('📢 Criando notificações...');

        const notificationsData = [];
        const notificationMessages = [
            'Dispositivo adicionado com sucesso',
            'Sensor de temperatura ativado',
            'Movimento detectado na sala',
            'Porta principal desbloqueada',
            'Sistema de segurança ativado',
            'Temperatura ajustada automaticamente',
            'Fumo detectado na cozinha',
            'Janela aberta no quarto',
            'Luz acesa automaticamente',
            'Qualidade do ar monitorizada',
            'Dispositivo desconectado',
            'Bateria fraca detectada',
            'Atualização de firmware disponível',
            'Configuração alterada',
            'Modo noturno ativado'
        ];

        for (const hub of this.hubs) {
            for (let i = 0; i < CONFIG.NOTIFICATIONS_PER_HUB; i++) {
                const message = getRandomElement(notificationMessages);
                const daysAgo = getRandomInt(0, 30);
                const date = new Date();
                date.setDate(date.getDate() - daysAgo);
                date.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59));

                notificationsData.push({
                    description: message,
                    date: date,
                    hubid: hub.id
                });
            }
        }

        await Notification.bulkCreate(notificationsData);

        console.log(`✅ ${notificationsData.length} notificações criadas.\n`);
    }

    async seedHistory() {
        console.log('📊 Criando histórico de dispositivos...');

        let batchSize = 1000; // Process in batches to avoid memory issues
        let totalRecords = 0;

        for (let i = 0; i < this.devices.length; i += batchSize) {
            const deviceBatch = this.devices.slice(i, i + batchSize);
            const batchData = [];

            for (const device of deviceBatch) {
                for (let j = 0; j < CONFIG.HISTORY_RECORDS_PER_DEVICE; j++) {
                    const daysAgo = getRandomInt(0, 90);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);
                    date.setHours(getRandomInt(0, 23), getRandomInt(0, 59), getRandomInt(0, 59));

                    // Generate realistic values based on device type
                    let value;
                    const deviceTypeName = this.deviceTypes.find(dt => dt.id === device.type)?.name || '';

                    if (deviceTypeName.includes('Temperatura')) {
                        value = getRandomFloat(15, 35); // Temperature in Celsius
                    } else if (deviceTypeName.includes('Humidade')) {
                        value = getRandomFloat(30, 80); // Humidity percentage
                    } else if (deviceTypeName.includes('Luz') || deviceTypeName.includes('Dimmer')) {
                        value = getRandomInt(0, 100); // Brightness percentage
                    } else if (deviceTypeName.includes('Tomada') || deviceTypeName.includes('Fechadura')) {
                        value = getRandomInt(0, 1); // On/Off
                    } else if (deviceTypeName.includes('Movimento') || deviceTypeName.includes('Presença') || deviceTypeName.includes('Porta') || deviceTypeName.includes('Fumo') || deviceTypeName.includes('Vibração')) {
                        value = getRandomInt(0, 1); // Detected/Not detected
                    } else if (deviceTypeName.includes('Qualidade do Ar')) {
                        value = getRandomFloat(0, 500); // AQI
                    } else if (deviceTypeName.includes('Energia')) {
                        value = getRandomFloat(0, 5000); // Watts
                    } else if (deviceTypeName.includes('Termostato')) {
                        value = getRandomFloat(18, 28); // Target temperature
                    } else if (deviceTypeName.includes('Ventilador')) {
                        value = getRandomInt(0, 5); // Speed level 0-5
                    } else {
                        value = getRandomFloat(0, 100); // Generic percentage
                    }

                    batchData.push({
                        deviceid: device.id,
                        devicevalue: value,
                        date: date,
                        hubid: device.hubid
                    });
                }
            }

            await History.bulkCreate(batchData);
            totalRecords += batchData.length;

            console.log(`   Processados ${Math.min(i + batchSize, this.devices.length)}/${this.devices.length} dispositivos...`);
        }

        console.log(`✅ ${totalRecords} registros de histórico criados.\n`);
    }

    async displaySummary() {
        console.log('📈 RESUMO DA POPULAÇÃO DA BASE DE DADOS');
        console.log('=====================================');

        const hubCount = await Hub.count();
        const userCount = await User.count();
        const deviceTypeCount = await DeviceType.count();
        const divisionCount = await Division.count();
        const deviceCount = await Device.count();
        const notificationCount = await Notification.count();
        const historyCount = await History.count();

        console.log(`🏢 Hubs: ${hubCount}`);
        console.log(`👥 Utilizadores: ${userCount}`);
        console.log(`📱 Tipos de Dispositivos: ${deviceTypeCount}`);
        console.log(`🏠 Divisões: ${divisionCount}`);
        console.log(`🔌 Dispositivos: ${deviceCount}`);
        console.log(`📢 Notificações: ${notificationCount}`);
        console.log(`📊 Registros de Histórico: ${historyCount}`);
        console.log('=====================================');

        // Calculate some statistics for testing pagination
        console.log('\n📊 ESTATÍSTICAS PARA TESTES');
        console.log('============================');
        console.log(`📄 Páginas de hubs (10 por página): ${Math.ceil(hubCount / 10)}`);
        console.log(`📄 Páginas de dispositivos (20 por página): ${Math.ceil(deviceCount / 20)}`);
        console.log(`📄 Páginas de notificações (15 por página): ${Math.ceil(notificationCount / 15)}`);
        console.log(`📄 Páginas de histórico (50 por página): ${Math.ceil(historyCount / 50)}`);

        // Display some sample data for verification
        console.log('\n🔍 AMOSTRAS DE DADOS CRIADOS');
        console.log('============================');

        const sampleHub = await Hub.findOne();
        if (sampleHub) {
            console.log(`📍 Hub exemplo: "${sampleHub.name}" (ID: ${sampleHub.id})`);
        }

        const sampleDevice = await Device.findOne();
        if (sampleDevice) {
            console.log(`🔌 Dispositivo exemplo: "${sampleDevice.name}" (Código: ${sampleDevice.accesscode})`);
        }

        const recentNotification = await Notification.findOne({
            order: [['date', 'DESC']]
        });
        if (recentNotification) {
            console.log(`📢 Notificação recente: "${recentNotification.description}"`);
        }
    }
}

// Execute the seeder
async function main() {
    const seeder = new DatabaseSeeder();
    await seeder.run();
}

// Handle errors and exit
main().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});

module.exports = DatabaseSeeder;
