To set up **Nginx** as a reverse proxy for multiple services on an **EC2 server**, you need to configure Nginx to route incoming traffic to the appropriate backend services based on the domain name or path. Here’s how you can do it step-by-step:

### 1. **Install Nginx on the EC2 Server**

If Nginx is not already installed, you can install it using the package manager. Connect to your EC2 instance via SSH, then run:

```bash
# Update the package list
sudo apt update

# Install Nginx
sudo apt install nginx -y
```

### 2. **Start and Enable Nginx**

Start Nginx and enable it to run on boot:

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. **Configure Firewall (if necessary)**

Ensure that HTTP (port 80) and HTTPS (port 443) traffic is allowed:

```bash
sudo ufw allow 'Nginx Full'
```

### 4. **Create a New Nginx Configuration File**

Now, you need to create a new Nginx configuration file to handle multiple services.

- Open the Nginx configuration directory:

```bash
sudo nano /etc/nginx/sites-available/my_services.conf
```

- Add the following configuration based on your requirements:

#### Sample Configuration for Multiple Services

Replace `example.com`, `api.example.com`, and other placeholders with your actual domain names or IP addresses.

```nginx
server {
    listen 80;
    server_name example.com;

    # Web service
    location / {
        proxy_pass http://localhost:3000; # Replace with your web service port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.example.com;

    # API service
    location / {
        proxy_pass http://localhost:4000; # Replace with your API service port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name admin.example.com;

    # Admin service
    location / {
        proxy_pass http://localhost:5000; # Replace with your admin service port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. **Enable the New Configuration**

- Link the new configuration file to the `sites-enabled` directory:

```bash
sudo ln -s /etc/nginx/sites-available/my_services.conf /etc/nginx/sites-enabled/
```

- Test the Nginx configuration for syntax errors:

```bash
sudo nginx -t
```

- Reload Nginx to apply the changes:

```bash
sudo systemctl reload nginx
```

### 6. **Set Up SSL with Let’s Encrypt (Optional but Recommended)**

To secure your domains with HTTPS, use **Certbot** to get free SSL certificates:

- Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

- Run Certbot to automatically obtain and configure SSL certificates:

```bash
sudo certbot --nginx -d example.com -d api.example.com -d admin.example.com
```

- Follow the instructions to complete the SSL certificate issuance.

### 7. **Verify Everything is Working**

- Open your web browser and visit each domain (`example.com`, `api.example.com`, etc.) to ensure they correctly route to the appropriate services.

### 8. **Monitor Nginx Logs**

If you run into issues, check the Nginx error logs for details:

```bash
sudo tail -f /var/log/nginx/error.log
```

### Summary

By following these steps, you set up Nginx as a reverse proxy to handle multiple services on an EC2 server. The proxy directs traffic to different backend services based on the domain or path, and optionally secures traffic with SSL/TLS using Certbot.
