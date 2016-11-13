# Nginx Reverse-proxy configuration

There is some detail in this configuration but basically there will be 4 servers running the service at once, and traffic
will be rerouted to any of these 4 concurrent servers. Also the webservice can be reached directly by homepage instead of specifying port,
but users may specify port if they choose to.

## Required instructions

When setting this website up, change the server_name parameter to your server's DNS. Run "sudo cp -f nginx.conf /etc/nginx/nginx.conf" to replace this configuration file with default one.
