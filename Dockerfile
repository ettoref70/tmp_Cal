# Usa un'immagine ufficiale Node.js
FROM node:18

# Imposta la directory di lavoro
WORKDIR /app

# Copia package.json e lock per caching dei moduli
COPY package*.json ./

# Installa solo le dipendenze di produzione
RUN npm install --omit=dev

# Copia tutto il resto (incluso backend/)
COPY . .

# Esponi la porta usata dall'app
EXPOSE 8080

# Avvia il server
CMD ["node", "backend/server.js"]
