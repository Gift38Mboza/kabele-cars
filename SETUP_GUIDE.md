# 🚗 KALABE MOTORS — PHP BACKEND SETUP GUIDE

## 📋 TABLE OF CONTENTS
1. [Requirements](#requirements)
2. [Installation Steps](#installation-steps)
3. [Database Setup](#database-setup)
4. [Configuration](#configuration)
5. [File Structure](#file-structure)
6. [API Documentation](#api-documentation)
7. [Testing](#testing)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

---

## ✅ REQUIREMENTS

- **PHP**: Version 7.4 or higher
- **MySQL**: Version 5.7 or MariaDB 10.3+
- **Web Server**: Apache with mod_rewrite or Nginx
- **PHP Extensions**: mysqli, fileinfo, filter
- **Disk Space**: Minimum 500MB for uploads and database

### Recommended Environment
- PHP 8.1+
- MySQL 8.0+
- Apache 2.4+ or Nginx 1.20+
- Let's Encrypt SSL Certificate (for HTTPS)

---

## 🚀 INSTALLATION STEPS

### Step 1: Upload Files to Server

1. Connect to your web server via FTP or SSH
2. Upload the following files to your document root:
   ```
   /home/your-domain/public_html/
   ├── contact.php
   ├── book_vehicle.php
   ├── config.php
   └── uploads/          (create this directory)
       └── nrc_documents/
   ```

3. Set directory permissions:
   ```bash
   chmod 755 /path/to/uploads
   chmod 755 /path/to/uploads/nrc_documents
   chmod 644 contact.php book_vehicle.php config.php
   ```

### Step 2: Create MySQL Database

1. **Via phpMyAdmin:**
   - Log in to phpMyAdmin
   - Click "New" to create a new database
   - Database name: `kalabe_motors`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

2. **Via MySQL Command Line:**
   ```bash
   mysql -u root -p
   > CREATE DATABASE kalabe_motors CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   > USE kalabe_motors;
   > [Paste the SQL from kalabe_database.sql file]
   > exit;
   ```

3. **Via SSH (recommended):**
   ```bash
   mysql -u root -p < kalabe_database.sql
   ```

### Step 3: Import Database Schema

1. Copy all SQL from **kalabe_database.sql**
2. In phpMyAdmin, select the `kalabe_motors` database
3. Click "SQL" tab
4. Paste the entire SQL code
5. Click "Go" to execute

✅ You should see confirmation: "MySQL returned an empty result set"

### Step 4: Create Database User (Security)

Create a dedicated MySQL user instead of using root:

```bash
mysql -u root -p
> CREATE USER 'kalabe_user'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';
> GRANT ALL PRIVILEGES ON kalabe_motors.* TO 'kalabe_user'@'localhost';
> FLUSH PRIVILEGES;
> exit;
```

Then update `config.php`:
```php
define('DB_USER', 'kalabe_user');
define('DB_PASS', 'YourSecurePassword123!');
```

---

## ⚙️ CONFIGURATION

### Update config.php

Edit the following in **config.php**:

```php
// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'kalabe_user');      // Your database user
define('DB_PASS', 'YourPassword123!'); // Your database password
define('DB_NAME', 'kalabe_motors');

// Your website domain
define('APP_URL', 'https://www.kalabelogistics.com');

// Contact emails
define('ADMIN_EMAIL', 'admin@kalabelogistics.com');
define('SUPPORT_EMAIL', 'info@kalabelogistics.com');
define('SUPPORT_PHONE', '+260970402241');
```

### Update HTML Forms

In your **index.html**, ensure the form actions point to your server:

```html
<!-- Contact form -->
<form action="https://www.kalabelogistics.com/contact.php" method="POST">
  ...
</form>

<!-- Booking form -->
<form action="https://www.kalabelogistics.com/book_vehicle.php" method="POST" enctype="multipart/form-data">
  ...
</form>
```

### Update JavaScript

In **script.js**, ensure form submission uses POST to your PHP files:

```javascript
const form = document.getElementById('contact-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Use fetch API
  fetch('contact.php', {
    method: 'POST',
    body: new FormData(form)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast('Message sent successfully!', 'success');
      form.reset();
    } else {
      showToast(data.message, 'error');
    }
  })
  .catch(error => {
    showToast('Error sending message', 'error');
    console.error(error);
  });
});
```

---

## 📁 FILE STRUCTURE

```
project-root/
├── index.html
├── style.css
├── script.js
├── contact.php           ← Contact form handler
├── book_vehicle.php      ← Booking form handler
├── config.php            ← Database config & utilities
├── kalabe_database.sql   ← Database schema (import once)
├── uploads/
│   └── nrc_documents/    ← Store user NRC files here
├── logs/                 ← Error logs
└── admin/               ← Optional: admin dashboard
    ├── dashboard.php
    ├── bookings.php
    ├── contacts.php
    └── vehicles.php
```

---

## 📡 API DOCUMENTATION

### 1. CONTACT FORM ENDPOINT

**URL**: `/contact.php`  
**Method**: `POST`  
**Content-Type**: `application/x-www-form-urlencoded`

#### Request Parameters
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| name | string | Yes | "John Mwale" |
| email | string | Yes | "john@example.com" |
| phone | string | No | "+260970000000" |
| subject | string | Yes | "Vehicle Reservation" |
| message | string | Yes | "I would like to book..." |

#### Example Request
```bash
curl -X POST https://kalabelogistics.com/contact.php \
  -d "name=John Mwale" \
  -d "email=john@example.com" \
  -d "phone=+260970000000" \
  -d "subject=Vehicle Reservation" \
  -d "message=I would like to book a vehicle for..."
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Thank you! Your message has been received.",
  "reference_id": 42,
  "redirect": "#contact"
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Please fix the following errors:",
  "errors": {
    "email": "Please enter a valid email address",
    "message": "Message must be between 10 and 5000 characters"
  }
}
```

---

### 2. BOOKING FORM ENDPOINT

**URL**: `/book_vehicle.php`  
**Method**: `POST`  
**Content-Type**: `multipart/form-data`

#### Request Parameters
| Parameter | Type | Required | Example |
|-----------|------|----------|---------|
| first_name | string | Yes | "John" |
| last_name | string | Yes | "Mwale" |
| email | string | Yes | "john@example.com" |
| phone | string | Yes | "+260970000000" |
| nrc_number | string | No | "123456/01/1" |
| nrc_document | file | No | nrc.jpg (max 5MB) |
| vehicle_id | integer | Yes | 1 |
| start_date | date | Yes | "2024-03-15" |
| end_date | date | Yes | "2024-03-18" |
| purpose | string | No | "Safari trip" |

#### Example Request
```bash
curl -X POST https://kalabelogistics.com/book_vehicle.php \
  -F "first_name=John" \
  -F "last_name=Mwale" \
  -F "email=john@example.com" \
  -F "phone=+260970000000" \
  -F "vehicle_id=1" \
  -F "start_date=2024-03-15" \
  -F "end_date=2024-03-18" \
  -F "nrc_document=@nrc.jpg"
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Booking confirmed! Check your email for details.",
  "booking_ref": "KM-202403151425-A7B9C2",
  "booking_id": 15,
  "vehicle_name": "Honda Fit Hybrid",
  "start_date": "March 15, 2024",
  "end_date": "March 18, 2024",
  "duration_days": 3,
  "total_cost": "1650.00",
  "customer_email": "john@example.com",
  "whatsapp_link": "https://wa.me/260970402241?text=..."
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Please fix the following errors:",
  "errors": {
    "vehicle_id": "Selected vehicle is not available",
    "end_date": "Return date must be after pick-up date"
  }
}
```

---

## 🧪 TESTING

### Test Contact Form Submission

```bash
# Test with curl
curl -X POST http://localhost/contact.php \
  -d "name=Test User" \
  -d "email=test@example.com" \
  -d "subject=Test Subject" \
  -d "message=This is a test message with at least 10 characters."
```

### Test Booking Form Submission

```bash
# Test with curl and file upload
curl -X POST http://localhost/book_vehicle.php \
  -F "first_name=Test" \
  -F "last_name=User" \
  -F "email=test@example.com" \
  -F "phone=+260970000000" \
  -F "vehicle_id=1" \
  -F "start_date=2024-12-15" \
  -F "end_date=2024-12-18" \
  -F "nrc_document=@/path/to/test.jpg"
```

### Check Database Records

```bash
# Connect to MySQL
mysql -u kalabe_user -p kalabe_motors

# View contact submissions
> SELECT * FROM contacts;

# View bookings
> SELECT * FROM bookings;

# View payments
> SELECT * FROM payments;
```

---

## 🔒 SECURITY BEST PRACTICES

### 1. Use HTTPS
Always use HTTPS in production:
```bash
# In config.php
define('APP_URL', 'https://www.kalabelogistics.com');
```

### 2. Set File Permissions
```bash
# Read-only for config files
chmod 444 config.php

# Writable for uploads
chmod 755 uploads/
chmod 755 uploads/nrc_documents/

# Logs directory
chmod 755 logs/
```

### 3. Database Security
- ✅ Use strong passwords (min. 12 characters)
- ✅ Create limited-privilege database user
- ✅ Never commit credentials to version control
- ✅ Use environment variables for sensitive data

### 4. Input Validation
All forms validate:
- Email format (RFC 5322 compliant)
- Phone number length (7-20 digits)
- File type and size (NRC documents)
- Date range (start before end)
- Text length limits

### 5. File Upload Security
- Maximum file size: 5MB
- Allowed types: JPG, PNG, PDF only
- MIME type validation
- Files stored outside web root (recommended)
- Filename randomized

### 6. SQL Injection Prevention
All database queries use **prepared statements**:
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
```

### 7. Email Validation
- Sent to verified email addresses
- Confirmation emails help detect typos
- WhatsApp confirmation required for bookings

### 8. Rate Limiting (Optional)
Implement rate limiting in production:
```php
// Limit submissions to 5 per hour per IP
$ip = $_SERVER['REMOTE_ADDR'];
$key = "rate_limit:" . $ip;
// Use Redis or file-based tracking
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Database connection failed"

**Solution:**
1. Verify database credentials in `config.php`
2. Check if MySQL service is running:
   ```bash
   sudo systemctl status mysql
   ```
3. Test connection manually:
   ```bash
   mysql -h localhost -u kalabe_user -p
   ```

### Problem: File uploads not working

**Solution:**
1. Check directory permissions:
   ```bash
   ls -la uploads/
   chmod 755 uploads/
   chmod 755 uploads/nrc_documents/
   ```
2. Check PHP upload settings in `php.ini`:
   ```
   upload_max_filesize = 10M
   post_max_size = 10M
   ```
3. Restart web server:
   ```bash
   sudo systemctl restart apache2
   # or
   sudo systemctl restart nginx
   ```

### Problem: Emails not sending

**Solution:**
1. Check if PHP mail is configured:
   ```bash
   php -i | grep "mail"
   ```
2. Install Postfix (on Linux):
   ```bash
   sudo apt-get install postfix
   ```
3. Test mail function:
   ```php
   <?php
   $to = 'test@example.com';
   $subject = 'Test Email';
   $message = 'This is a test.';
   if (mail($to, $subject, $message)) {
     echo 'Email sent successfully';
   } else {
     echo 'Email failed';
   }
   ?>
   ```

### Problem: "Memory exhausted" error

**Solution:**
1. Increase PHP memory limit in `php.ini`:
   ```
   memory_limit = 256M
   ```
2. Restart web server

### Problem: CORS errors in browser console

**Solution:**
The PHP files already include CORS headers:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
```

If still having issues, check your web server configuration.

### Problem: Database tables not created

**Solution:**
1. Check if database exists:
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```
2. Re-import the SQL file:
   ```bash
   mysql -u kalabe_user -p kalabe_motors < kalabe_database.sql
   ```
3. Verify tables were created:
   ```bash
   mysql -u kalabe_user -p kalabe_motors -e "SHOW TABLES;"
   ```

---

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs: `tail -f logs/errors.log`
- Check database size

**Weekly:**
- Backup database: `mysqldump -u root -p kalabe_motors > backup.sql`
- Review bookings and contacts
- Check server disk space

**Monthly:**
- Update PHP/MySQL if security patches available
- Review and optimize slow database queries
- Clean up old log files

### Useful MySQL Queries

```sql
-- Get total bookings this month
SELECT COUNT(*) FROM bookings WHERE MONTH(created_at) = MONTH(NOW());

-- Get total revenue this month
SELECT SUM(total_cost) FROM bookings WHERE MONTH(created_at) = MONTH(NOW());

-- Get pending bookings
SELECT * FROM bookings WHERE status = 'pending' ORDER BY created_at DESC;

-- Get unread contacts
SELECT * FROM contacts WHERE status = 'new' ORDER BY created_at DESC;

-- Get popular vehicles
SELECT vehicle_id, name, COUNT(*) as bookings FROM bookings b
JOIN vehicles v ON b.vehicle_id = v.id
GROUP BY vehicle_id ORDER BY bookings DESC;
```

---

## ✨ NEXT STEPS

1. ✅ Set up database
2. ✅ Update config.php with your credentials
3. ✅ Test form submissions
4. ✅ Set up SSL certificate (HTTPS)
5. ✅ Create admin dashboard (optional)
6. ✅ Set up automated backups
7. ✅ Monitor and maintain regularly

---

**Last Updated**: March 2024  
**Version**: 1.0  
**Support**: info@kalabelogistics.com | +260 970 402 241

