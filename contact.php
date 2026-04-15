<?php
// ============================================================
// contact.php — Contact form + PHP/MySQL handler
// Kalabe Motors & Transportation Logistics Limited
// ============================================================

require_once __DIR__ . '/config.php';

$success = "";
$error   = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name    = trim(htmlspecialchars($_POST["name"]    ?? ""));
    $email   = trim(filter_var($_POST["email"] ?? "", FILTER_SANITIZE_EMAIL));
    $phone   = trim(htmlspecialchars($_POST["phone"]   ?? ""));
    $subject = trim(htmlspecialchars($_POST["subject"] ?? ""));
    $message = trim(htmlspecialchars($_POST["message"] ?? ""));

    if (!$name || !$email || !$message) {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            $error = "Database connection failed. Please try again later.";
        } else {
            $conn->set_charset('utf8mb4');
            $stmt = $conn->prepare("
                INSERT INTO contact_messages (name, email, phone, subject, message, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
            ");
            $stmt->bind_param("sssss", $name, $email, $phone, $subject, $message);
            if ($stmt->execute()) {
                $ref     = "KM-MSG-" . $stmt->insert_id;
                $success = "Message sent! Reference: <strong>$ref</strong>. We'll reply within 30 minutes.";

                // Optional: send email notification
                $to      = "info@kalabelogistics.com";
                $subj    = "New Contact: $subject — $name";
                $body    = "Name: $name\nEmail: $email\nPhone: $phone\nSubject: $subject\n\nMessage:\n$message";
                $headers = "From: $email";
                @mail($to, $subj, $body, $headers);
            } else {
                $error = "Failed to send message: " . $stmt->error;
            }
            $stmt->close();
            $conn->close();
        }
    }
}

// ── SQL to create the contact_messages table (run once) ───────
/*
CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    phone      VARCHAR(30),
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    is_read    TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/
?>
<?php if ($success): ?>
<style>
  .msg-confirm {
    background: #0A2558;
    border-radius: 16px;
    overflow: hidden;
    max-width: 560px;
    margin: 0 auto 32px;
    font-family: 'Open Sans', sans-serif;
  }

  .msg-confirm-top {
    padding: 32px;
    text-align: center;
  }

  .msg-confirm-icon {
    width: 64px;
    height: 64px;
    background: #F5B800;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 16px;
  }

  .msg-confirm-title {
    font-family: 'Oswald', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px;
  }

  .msg-confirm-title span {
    color: #F5B800;
  }

  .msg-confirm-sub {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }

  .msg-confirm-bottom {
    background: #fff;
    padding: 24px 32px;
  }

  .msg-confirm-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f1f1f1;
    font-size: 14px;
    color: #1a1a2e;
  }

  .msg-confirm-row:last-of-type {
    border-bottom: none;
  }

  .msg-confirm-row-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .msg-confirm-wa {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 12px 16px;
    text-decoration: none;
    margin-top: 16px;
  }

  .msg-confirm-wa-dot {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #25D366;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .msg-confirm-wa strong {
    display: block;
    color: #14532d;
    font-size: 14px;
    font-weight: 700;
  }

  .msg-confirm-wa span {
    color: #166634;
    font-size: 12px;
  }

  .msg-confirm-home {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0A2558;
  color: #fff;
  font-family: 'Oswald', sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  border-radius: 10px;
  padding: 14px;
  margin-top: 12px;
  transition: background 0.2s;
}

.msg-confirm-home:hover {
  background: #0c2d6b;
}
</style>

<div class="msg-confirm">
  <div class="msg-confirm-top">
    <div class="msg-confirm-icon">✉️</div>
    <h2 class="msg-confirm-title">Message <span>received!</span></h2>
    <p class="msg-confirm-sub">
      Thanks for reaching out to Kalabe Motors.<br>
      We'll get back to you within 30 minutes.
    </p>
  </div>

  <div class="msg-confirm-bottom">

    <div class="msg-confirm-row">
      <div class="msg-confirm-row-icon" style="background: #E6F1FB;">📬</div>
      <span>Check your email  a copy of your message is on its way.</span>
    </div>

    <div class="msg-confirm-row">
      <div class="msg-confirm-row-icon" style="background: #EAF3DE;">📞</div>
      <span>Our team will call or WhatsApp you shortly.</span>
    </div>

    <div class="msg-confirm-row">
      <div class="msg-confirm-row-icon" style="background: #FEF3C7;">🕐</div>
      <span>We're available Mon–Sun, 6:00 AM – 10:00 PM.</span>
    </div>

    <a class="msg-confirm-wa" href="https://wa.me/260970402241" target="_blank">
      <div class="msg-confirm-wa-dot">💬</div>
      <div>
        <strong>Chat on WhatsApp</strong>
        <span>+260 970 402 241 · replies in minutes</span>
      </div>
    </a>

    <a class="msg-confirm-home" href="index.html">
  🏠 &nbsp;Back to Home
</a>

  </div>
</div>
<?php endif; ?>