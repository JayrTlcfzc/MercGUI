# devops/docker-build/Dockerfile

FROM httpd:alpine

# Set working directory
WORKDIR /usr/local/apache2/htdocs/

# Copy dist from the context (root, since we run docker build from NufinMercGUI/)
COPY dist/ .

EXPOSE 80

CMD ["httpd-foreground"]
