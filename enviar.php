<?php
/**
 * Endpoint do formulário de proposta — ConexOn
 * Recebe JSON do index.html e envia por SMTP autenticado (Hostinger).
 */

declare(strict_types=1);

require __DIR__ . '/vendor/PHPMailer/Exception.php';
require __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');

$cfg = require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: ' . $cfg['allowed_origin']);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function responder(int $codigo, bool $ok, string $mensagem): void {
    http_response_code($codigo);
    echo json_encode(['ok' => $ok, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(405, false, 'Método não permitido.');
}

$bruto = file_get_contents('php://input');
$dados = json_decode($bruto, true);

if (!is_array($dados)) {
    responder(400, false, 'Dados inválidos.');
}

// --- Honeypot: campo invisível que só robô preenche ---
if (!empty($dados['website'])) {
    responder(200, true, 'Recebido.'); // resposta falsa de sucesso para o bot
}

// --- Limpeza e validação ---
function limpar($valor): string {
    return trim(strip_tags((string)($valor ?? '')));
}

$nome           = limpar($dados['nome'] ?? '');
$email          = limpar($dados['email'] ?? '');
$whatsapp       = limpar($dados['whatsapp'] ?? '');
$empresa_cidade = limpar($dados['empresa_cidade'] ?? '');
$solucao        = limpar($dados['solucao'] ?? '');
$pontos         = limpar($dados['pontos'] ?? '');
$mensagem       = limpar($dados['mensagem'] ?? '');

if ($nome === '' || mb_strlen($nome) > 120) {
    responder(422, false, 'Informe seu nome.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, false, 'Informe um e-mail válido.');
}
if (mb_strlen($mensagem) > 5000) {
    responder(422, false, 'Mensagem muito longa.');
}

// --- Limite simples por IP: 1 envio a cada 60s ---
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
$arquivo = sys_get_temp_dir() . '/conexon_' . md5($ip);
if (file_exists($arquivo) && (time() - filemtime($arquivo)) < 60) {
    responder(429, false, 'Aguarde um minuto antes de enviar de novo.');
}
touch($arquivo);

// --- Montagem do e-mail ---
$linhas = [
    'Nome'             => $nome,
    'E-mail'           => $email,
    'WhatsApp'         => $whatsapp,
    'Empresa / Cidade' => $empresa_cidade,
    'Solução'          => $solucao,
    'Pontos'           => $pontos,
];

$html = '<h2 style="font-family:Arial,sans-serif">Nova proposta pelo site</h2><table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">';
foreach ($linhas as $rotulo => $valor) {
    if ($valor === '') { continue; }
    $html .= '<tr>'
          . '<td style="padding:6px 14px 6px 0;color:#666;vertical-align:top"><strong>' . htmlspecialchars($rotulo) . '</strong></td>'
          . '<td style="padding:6px 0">' . htmlspecialchars($valor) . '</td>'
          . '</tr>';
}
$html .= '</table>';

if ($mensagem !== '') {
    $html .= '<p style="font-family:Arial,sans-serif;font-size:14px"><strong>Mensagem</strong><br>'
          . nl2br(htmlspecialchars($mensagem)) . '</p>';
}

$html .= '<hr style="border:none;border-top:1px solid #eee;margin:24px 0">'
      . '<p style="font-family:Arial,sans-serif;font-size:12px;color:#999">Enviado pelo formulário de conexonline.com.br em '
      . date('d/m/Y H:i') . '</p>';

// --- Envio ---
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $cfg['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $cfg['smtp_user'];
    $mail->Password   = $cfg['smtp_pass'];
    $mail->SMTPSecure = $cfg['smtp_secure'];
    $mail->Port       = (int)$cfg['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($cfg['from_email'], $cfg['from_name']);
    $mail->addAddress($cfg['to_email'], $cfg['to_name']);
    $mail->addReplyTo($email, $nome !== '' ? $nome : $email);

    $mail->isHTML(true);
    $mail->Subject = 'Proposta pelo site — ' . ($empresa_cidade !== '' ? $empresa_cidade : $nome);
    $mail->Body    = $html;
    $mail->AltBody = strip_tags(str_replace(['</tr>', '<br>'], "\n", $html));

    $mail->send();
    responder(200, true, 'Recebido.');

} catch (Exception $e) {
    error_log('[ConexOn] Falha no envio: ' . $mail->ErrorInfo);
    responder(500, false, 'Não conseguimos enviar agora. Tente de novo ou fale com a gente no WhatsApp.');
}
