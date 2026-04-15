<?php
// ============================================================
// book_vehicle.php — Booking form + PHP/MySQL handler
// Kalabe Motors & Transportation Logistics Limited
// ============================================================

require_once __DIR__ . '/config.php';

$success = "";
$error   = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // ── Sanitise inputs ──────────────────────────────────────
    $first_name  = trim(htmlspecialchars($_POST["first_name"]  ?? ""));
    $last_name   = trim(htmlspecialchars($_POST["last_name"]   ?? ""));
    $email       = trim(filter_var($_POST["email"] ?? "", FILTER_SANITIZE_EMAIL));
    $phone       = trim(htmlspecialchars($_POST["phone"]       ?? ""));
    $nrc_number  = trim(htmlspecialchars($_POST["nrc_number"]  ?? ""));
    $vehicle_id  = intval($_POST["vehicle_id"]  ?? 0);
    $vehicle_name= trim(htmlspecialchars($_POST["vehicle_name"] ?? ""));
    $start_date  = trim($_POST["start_date"]  ?? "");
    $end_date    = trim($_POST["end_date"]    ?? "");
    $purpose     = trim(htmlspecialchars($_POST["purpose"]     ?? ""));
    $daily_rate  = floatval($_POST["daily_rate"] ?? 0);
    $num_days    = intval($_POST["num_days"]     ?? 0);
    $total_price = floatval($_POST["total_price"]?? 0);

    // ── Handle NRC document upload ───────────────────────────
    $nrc_doc_path = "";
    if (!empty($_FILES["nrc_document"]["name"])) {
        $upload_dir = "uploads/nrc/";
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);
        $ext       = pathinfo($_FILES["nrc_document"]["name"], PATHINFO_EXTENSION);
        $safe_name = "nrc_" . time() . "_" . rand(1000, 9999) . "." . $ext;
        $dest      = $upload_dir . $safe_name;
        if (move_uploaded_file($_FILES["nrc_document"]["tmp_name"], $dest)) {
            $nrc_doc_path = $dest;
        }
    }

    // ── Validate required fields ─────────────────────────────
    if (!$first_name || !$last_name || !$email || !$phone || !$vehicle_id || !$start_date || !$end_date) {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } elseif (strtotime($end_date) <= strtotime($start_date)) {
        $error = "Return date must be after pick-up date.";
    } else {
        // ── Insert into database ─────────────────────────────
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            $error = "Database connection failed. Please try again.";
        } else {
            $conn->set_charset('utf8mb4');
            $stmt = $conn->prepare("
                INSERT INTO bookings
                    (first_name, last_name, email, phone, nrc_number, nrc_document,
                     vehicle_id, vehicle_name, start_date, end_date,
                     purpose, daily_rate, num_days, total_price, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            // Types: 6×string, vehicle_id int, 4×string, daily_rate double, num_days int, total_price double
            $stmt->bind_param(
                "ssssssissssdid",
                $first_name, $last_name, $email, $phone, $nrc_number, $nrc_doc_path,
                $vehicle_id, $vehicle_name, $start_date, $end_date,
                $purpose, $daily_rate, $num_days, $total_price
            );
            if ($stmt->execute()) {
                $booking_ref = "KML-" . date("Ymd") . "-" . $stmt->insert_id;
                $success = "Booking confirmed! Your reference is <strong>$booking_ref</strong>.";
            } else {
                $error = "Booking failed: " . $stmt->error;
            }
            $stmt->close();
            $conn->close();
        }
    }
}

// ── SQL to create the bookings table (run once) ───────────────
/*
CREATE TABLE IF NOT EXISTS bookings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    phone         VARCHAR(30)  NOT NULL,
    nrc_number    VARCHAR(50),
    nrc_document  VARCHAR(255),
    vehicle_id    INT          NOT NULL,
    vehicle_name  VARCHAR(150),
    start_date    DATE         NOT NULL,
    end_date      DATE         NOT NULL,
    purpose       TEXT,
    daily_rate    DECIMAL(10,2),
    num_days      INT,
    total_price   DECIMAL(10,2),
    status        ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/
?>
<?php if ($success): ?>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Open+Sans:wght@400;600&display=swap');

  .km-wrap {
    font-family: 'Open Sans', sans-serif;
    background: #0A2558;
    border-radius: 16px;
    overflow: hidden;
    max-width: 560px;
    margin: 0 auto 32px;
  }

  .km-top {
    padding: 36px 32px 28px;
    text-align: center;
  }

  .km-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #F5B800;
    color: #0A2558;
    padding: 8px 20px;
    border-radius: 40px;
    font-family: 'Oswald', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 18px;
  }

  .km-headline {
    font-family: 'Oswald', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px;
  }

  .km-headline span {
    color: #F5B800;
  }

  .km-sub {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    margin: 0;
  }

  /* --- Animated Road --- */

  .km-road {
    position: relative;
    height: 56px;
    background: #1a3a7a;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .km-road-line {
    position: absolute;
    top: 50%;
    height: 3px;
    background: #F5B800;
    width: 100%;
    transform: scaleX(0);
    transform-origin: left;
    animation: roadIn 0.8s 0.3s ease-out forwards;
  }

  .km-car {
    position: absolute;
    left: -60px;
    font-size: 28px;
    animation: driveIn 1s 0.2s cubic-bezier(0.2, 0, 0.4, 1.4) forwards;
  }

  .km-flag {
    position: absolute;
    right: 32px;
    font-size: 22px;
    opacity: 0;
    animation: popIn 0.4s 1.1s ease-out forwards;
  }

  @keyframes roadIn {
    to { transform: scaleX(1); }
  }

  @keyframes driveIn {
    to { left: calc(100% - 90px); }
  }

  @keyframes popIn {
    to { opacity: 1; }
  }

  /* --- White Bottom Section --- */

  .km-bottom {
    background: #fff;
    padding: 28px 32px 24px;
  }

  /* --- Steps --- */

  .km-steps {
    display: flex;
    flex-direction: column;
    margin-bottom: 22px;
  }

  .km-step {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f1f1f1;
  }

  .km-step:last-child {
    border-bottom: none;
  }

  .km-step-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .km-step-title {
    font-weight: 700;
    font-size: 14px;
    color: #0A2558;
    margin: 0 0 2px;
  }

  .km-step-desc {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }

  /* --- Divider --- */

  .km-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .km-divider hr {
    flex: 1;
    border: none;
    border-top: 1px solid #e5e7eb;
  }

  .km-divider span {
    font-size: 11px;
    color: #9ca3af;
    font-weight: 600;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* --- WhatsApp Button --- */

  .km-wa {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 13px 18px;
    text-decoration: none;
  }

  .km-wa-dot {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #25D366;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .km-wa strong {
    display: block;
    color: #14532d;
    font-size: 14px;
    font-weight: 700;
  }

  .km-wa span {
    color: #166634;
    font-size: 12px;
  }

  /* --- Booking ID --- */

  .km-ref {
    text-align: center;
    margin-top: 16px;
    font-size: 12px;
    color: #9ca3af;
  }

  .km-ref b {
    color: #0A2558;
    font-family: 'Oswald', sans-serif;
    font-size: 14px;
    letter-spacing: 1px;
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

<div class="km-wrap">
  <div class="km-top">
    <div class="km-badge">✓ &nbsp;Booking confirmed</div>
    <h1 class="km-headline">Your adventure <span>starts now!</span></h1>
    <p class="km-sub">We've got your reservation and we're already on it.<br>Expect a call or WhatsApp in under 30 minutes.</p>
  </div>

  <div class="km-road">
    <div class="km-road-line"></div>
    <div class="km-car"></div>
    <div class="km-flag">🏁</div>
  </div>

  <div class="km-bottom">
    <div class="km-steps">
      <div class="km-step">
        <div class="km-step-icon" style="background: #E6F1FB;">📞</div>
        <div>
          <p class="km-step-title">We'll call you first</p>
          <p class="km-step-desc">Our team calls or WhatsApps you within 30 minutes to confirm your vehicle and details.</p>
        </div>
      </div>
      <div class="km-step">
        <div class="km-step-icon" style="background: #EAF3DE;">📋</div>
        <div>
          <p class="km-step-title">Booking reference sent</p>
          <p class="km-step-desc">A confirmation with your reference number lands in your email, keep it handy.</p>
        </div>
      </div>
      <div class="km-step">
        <div class="km-step-icon" style="background: #FEF3C7;"></div>
        <div>
          <p class="km-step-title">Keys in hand, roads ahead</p>
          <p class="km-step-desc">Your vehicle is prepped, GPS-tracked and fully insured ready on your pick-up date.</p>
        </div>
      </div>
    </div>

    <div class="km-divider">
      <hr/>
      <span>Need help now?</span>
      <hr/>
    </div>

    <a class="km-wa" href="https://wa.me/260970402241" target="_blank">
      <div class="km-wa-dot">💬</div>
      <div>
        <strong>Chat on WhatsApp</strong>
        <span>+260 970 402 241 · replies in minutes</span>
      </div>
    </a>

    <p class="km-ref">
      Your booking ID &nbsp;·&nbsp;
      <b>KM-<?= strtoupper(substr(md5(time()), 0, 8)) ?></b>
    </p>
    
      <a class="msg-confirm-home" href="index.html">
  🏠 &nbsp;Back to Home
</a>
  </div>
</div>
<?php endif; ?>