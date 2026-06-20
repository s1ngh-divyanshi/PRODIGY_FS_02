# Use a lightweight version of Node.js
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to cache dependencies
COPY package*.json ./

# Install only production dependencies (skips devDependencies if you had any)
RUN npm install --production

# Copy the rest of your backend code into the container
COPY . .

# Expose the port Cloud Run will use (Cloud Run overrides this dynamically, but it's good practice)
EXPOSE 5001

# The command to start your server
CMD ["node", "server.js"]