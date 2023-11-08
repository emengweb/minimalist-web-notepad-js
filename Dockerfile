# Use the official Node.js image with Alpine Linux
FROM node:16-alpine

# Set the working directory for the app
WORKDIR /app

# Copy the app code to the container
COPY . .

# Install the dependencies
RUN npm install

# Expose the port that the app listens on
EXPOSE 8080

# Run the app when the container starts
CMD ["node", "index.js"]
