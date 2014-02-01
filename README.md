# Ethereum.org website

## Server installation
OS: Ubuntu 13.04 64-bit
```
sudo su
apt-get update && apt-get upgrade
apt-get install apache2
```

## Site configuration
Basic configuration for a single site. Additional sites need simialr steps run.
```
cd /var/www
mkdir www_ethereum_org
cd www_ethereum_org
mkdir public_html
mkdir logs
chown ubuntu public_html/ logs/
cd /etc/apache2/sites-available
cat > www_ethereum_org.conf << EOF
<VirtualHost *:80>
  ServerName www.ethereum.org
  #ServerAlias ethereum.org
  ServerAdmin webmaster@localhost
  DocumentRoot /var/www/www_ethereum_org/public_html
  #LogLevel info ssl:warn
  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF
a2ensite www_ethereum_org
service apache2 reload
```

## Deployment
Configure `deploy.sh` for your local environment and run it. You will need access to a secured copy (`chmod 600`) of the server certificate.
