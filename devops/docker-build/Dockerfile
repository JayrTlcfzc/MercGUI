# devops/docker-build/Dockerfile

FROM httpd:alpine

# Set working directory
WORKDIR /var/www/html/demoapp-merchant/

# Copy dist from the context (root, since we run docker build from NufinMercGUI/)
COPY dist/ .

EXPOSE 80

CMD ["httpd-foreground"]
