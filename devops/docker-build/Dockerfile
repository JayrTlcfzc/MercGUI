FROM httpd:alpine

# Copy only the contents of dist/ into the target directory
COPY dist/ /var/www/html/demoapp-merchant/

# Optional: custom Apache config if you need to change DocumentRoot, enable rewrite, etc.
# COPY devops/docker-build/httpd.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]
