<?php
// processar_comentari.php
// IMPORTANT: requires PHP 7.0+
// Author: implementació per Windsurf segons instruccions de Jan

header('Content-Type: application/json; charset=utf-8');

// CONFIG
$TO_EMAIL = 'jllobetsalmeron@gmail.com';
$FROM_DOMAIN = 'crepnova.cat'; // canviar pel teu domini real si en tens
$DATA_DIR = __DIR__ . '/data';
$SUBMISSIONS_FILE = $DATA_DIR . '/submissions.json';
$BLOCKED_FILE = $DATA_DIR . '/blocked_ips.json';
$EMAIL_LOG = $DATA_DIR . '/emails.log';

// Simple helper: obtenir IP real (respectant proxys bàsics)
function client_ip(){
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $xff = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($xff[0]);
    }
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// Assegura data dir
if (!is_dir($DATA_DIR)) {
    mkdir($DATA_DIR, 0700, true);
}

// Carrega JSON segurament
function load_json($path) {
    if (!file_exists($path)) return [];
    $txt = file_get_contents($path);
    $d = json_decode($txt, true);
    return is_array($d) ? $d : [];
}
function save_json($path, $data) {
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

// --- RATE-LIMIT / BLOCK CHECK
$ip = client_ip();
$now = time();
$blocked = load_json($BLOCKED_FILE);
if (isset($blocked[$ip]) && $blocked[$ip] > $now) {
    $remain = $blocked[$ip] - $now;
    echo json_encode(['success' => false, 'message' => "S'ha bloquejat aquesta IP per activitat sospitosa. Torna a intentar-ho d'aquí " . gmdate("H:i:s", $remain) . "."]);
    exit;
} elseif (isset($blocked[$ip]) && $blocked[$ip] <= $now) {
    // expired
    unset($blocked[$ip]);
    save_json($BLOCKED_FILE, $blocked);
}

// --- Llegeix i neteja inputs
function clean_text($s, $max=2000) {
    $s = trim($s);
    $s = strip_tags($s);              // treu HTML
    $s = htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    if (strlen($s) > $max) $s = mb_substr($s, 0, $max, 'UTF-8');
    return $s;
}

$nom = isset($_POST['nom']) ? clean_text($_POST['nom'], 100) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$tipus = isset($_POST['tipus']) ? clean_text($_POST['tipus'], 50) : '';
$missatge = isset($_POST['missatge']) ? clean_text($_POST['missatge'], 2000) : '';
$puntuacio = isset($_POST['puntuacio']) ? intval($_POST['puntuacio']) : 0;
$honeypot = isset($_POST['website']) ? trim($_POST['website']) : '';
$ts = isset($_POST['ts']) ? intval($_POST['ts']) : 0;

// Validacions bàsiques
if ($honeypot !== '') {
    // Trampeta detectada
    echo json_encode(['success' => false, 'message' => 'Enviament invalid.']);
    exit;
}

// Timestamp check: evitar submissions massa ràpides (bots)
if ($ts <= 0 || ($now - $ts) < 3) {
    echo json_encode(['success' => false, 'message' => 'Enviament massa ràpid. Si us plau espera uns segons i torna a provar.']);
    exit;
}

if (empty($nom) || empty($email) || empty($missatge)) {
    echo json_encode(['success' => false, 'message' => 'Si us plau completa tots els camps requerits.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Correu electrònic invàlid.']);
    exit;
}

// --- Rate limiting: permetem p.ex. 5 enviaments cada 60s, 20 en 24h. Si sobrepassa -> bloqueig 24h
$subs = load_json($SUBMISSIONS_FILE);
if (!isset($subs[$ip])) $subs[$ip] = [];
// netegem temps antics (24h)
$subs[$ip] = array_filter($subs[$ip], function($t) use ($now) { return ($t > $now - 86400); });

// afegim actual
$subs[$ip][] = $now;

// Comptem en 60s
$recentCount = count(array_filter($subs[$ip], function($t) use ($now){ return $t > $now - 60; }));
$dayCount = count($subs[$ip]);

// Reglas:
if ($recentCount > 5 || $dayCount > 200) {
    // bloquejar 24h
    $blocked[$ip] = $now + 86400;
    save_json($BLOCKED_FILE, $blocked);
    save_json($SUBMISSIONS_FILE, $subs);
    echo json_encode(['success' => false, 'message' => 'S’ha detectat comportament sospitós. Aquesta IP ha estat bloquejada 24 hores.']);
    exit;
}

// Guardem submissions
save_json($SUBMISSIONS_FILE, $subs);

// --- Prepara email HTML
$subject = "[Contacte Crep Nova] " . ($tipus ?: 'Missatge nou') . " — " . $nom;
$site = $_SERVER['HTTP_HOST'] ?? $FROM_DOMAIN;
$ipinfo = $ip;
$when = date('Y-m-d H:i:s', $now);

$emailHtml = "
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #111; }
    .wrap { max-width:700px; margin:0 auto; padding:20px; }
    .header { background:#ff0157; color:#fff; padding:12px; border-radius:6px 6px 0 0; }
    .content { border:1px solid #eee; padding:16px; border-radius:0 0 6px 6px; background:#fff; }
    .meta { font-size:0.9rem; color:#666; margin-bottom:12px; }
    .field { margin-bottom:12px; }
    .field strong { display:block; margin-bottom:6px; color:#333; }
    .message-box { white-space:pre-wrap; background:#fafafa; padding:12px; border-radius:6px; border:1px solid #f0f0f0; }
    .footer { margin-top:16px; font-size:0.9rem; color:#999; }
  </style>
</head>
<body>
  <div class='wrap'>
    <div class='header'><h2>Nou missatge de Contacte — Crep Nova</h2></div>
    <div class='content'>
      <div class='meta'>Rebut a <strong>{$when}</strong> des del domini <strong>{$site}</strong>. IP emissora: <strong>{$ipinfo}</strong></div>
      <div class='field'><strong>Nom</strong> {$nom}</div>
      <div class='field'><strong>Email</strong> {$email}</div>
      <div class='field'><strong>Tipus</strong> {$tipus}</div>
      <div class='field'><strong>Puntuació</strong> {$puntuacio} / 5</div>
      <div class='field'><strong>Missatge</strong>
        <div class='message-box'>{$missatge}</div>
      </div>
      <div class='footer'>Aquest missatge s'ha enviat automàticament. No respondis a aquest correu; respon directament a l'email del client si cal.</div>
    </div>
  </div>
</body>
</html>
";

// Prepare headers
$fromHeader = "noreply@{$FROM_DOMAIN}";
$headers = "From: Crep Nova <{$fromHeader}>\r\n";
$headers .= "Reply-To: {$nom} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";

// Tractament d'enviament:
// Opció 1: mail() natiu (funciona en hosting típic, però recomanem SMTP per fiabilitat)
$mail_ok = @mail($TO_EMAIL, $subject, $emailHtml, $headers);

// Registre local (backup)
$logEntry = [
    'when' => $when,
    'ip' => $ip,
    'name' => $nom,
    'email' => $email,
    'type' => $tipus,
    'score' => $puntuacio,
    'message' => $missatge,
    'sent' => $mail_ok ? true : false
];
file_put_contents($EMAIL_LOG, date('c') . " " . json_encode($logEntry, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);

// Resposta
if ($mail_ok) {
    echo json_encode(['success' => true, 'message' => 'Gràcies! El teu missatge s\'ha enviat correctament.']);
} else {
    echo json_encode(['success' => false, 'message' => 'No s\'ha pogut enviar el missatge. Contacta directament a jllobetsalmeron@gmail.com']);
}
exit;
