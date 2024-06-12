# Use Node 20 Alpine as the base image for the builder stage
FROM node:20-alpine AS builder

# Set the working directory for the builder stage
WORKDIR /app

# Copy the entire application directory into the container
COPY . .

# Install dependencies, including TypeScript
RUN npm install typescript --save-dev

# Build TypeScript files
RUN npm run build

# Use Node 20 Alpine as the base image for the final stage
FROM node:20-alpine AS final

# Set the working directory for the final stage
WORKDIR /app

# Copy the built application files from the builder stage into the final stage
COPY --from=builder /app/dist ./dist

# Copy package.json and package-lock.json for production dependencies installation
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "run", "start"]
