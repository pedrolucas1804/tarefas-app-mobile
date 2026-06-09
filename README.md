# Tarefas App – Frontend

App mobile de gerenciamento de tarefas com React Native e Expo.

## Requisitos
- Node.js instalado
- Expo Go instalado no celular

## Instalação

```bash
npm install
```

## Como rodar

```bash
npx expo start
```

Escaneie o QR Code com o app Expo Go no celular.

## Configuração do IP

Abra `services/api.js` e altere o `BASE_URL` com o IP da sua máquina:

- Emulador Android: `http://10.0.2.2:3000`
- Dispositivo físico: `http://SEU_IP_LOCAL:3000`
- Simulador iOS: `http://localhost:3000`
