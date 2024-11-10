# Folosește o versiune mai nouă de Node.js
FROM node:18-alpine

# Setarea directorului de lucru
WORKDIR /app

# Copierea fișierelor de dependențe
COPY package*.json ./

# Instalarea dependențelor
RUN npm install

# Copierea codului sursă în container
COPY . .

# Expunerea portului
EXPOSE 3000

# Comanda pentru rularea aplicației
CMD ["node", "server.js"]

