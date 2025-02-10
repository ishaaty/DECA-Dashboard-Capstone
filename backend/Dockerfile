# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY /backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your backend code
COPY backend .

# Expose the port your app runs on
EXPOSE 8080

# Start your backend
CMD ["node", "server.js"]
