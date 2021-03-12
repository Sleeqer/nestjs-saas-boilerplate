FROM node:carbon
# App directory
WORKDIR /app

# App dependencies
COPY package*.json ./
RUN npm i

# Copy app source code
COPY . .

# Env setup
COPY .env.example .env

# BUILD
RUN npm run build

# Start the app
CMD [ "npm", "run", "start:prod"]

#Expose port and begin application
EXPOSE 8000