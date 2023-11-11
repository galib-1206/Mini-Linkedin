# Use an official Node.js runtime as the base image
FROM node:16

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV DB_HOST=localhost
ENV DB_PORT=27017
ENV SECRET=mysecretkey

# Create a directory for your app
WORKDIR /usr/src/app

# Copy your application code into the container
COPY . .

# Install your app's dependencies
RUN npm install

# Expose the port on which your app will run
EXPOSE $PORT

# Start your application
CMD [ "npm", "start" ]
