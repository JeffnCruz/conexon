<?php
/**
 * Credenciais de envio — ConexOn
 *
 * COPIE este arquivo para "config.php" no servidor e preencha a senha.
 * O config.php NÃO deve ir para o GitHub (veja o .gitignore).
 */

return [
    // SMTP do Hostinger
    'smtp_host'   => 'smtp.hostinger.com',
    'smtp_port'   => 465,          // 465 = SSL. Se não conectar, use 587 (TLS).
    'smtp_secure' => 'ssl',        // 'ssl' para 465, 'tls' para 587

    // Caixa que envia (autenticação)
    'smtp_user'   => 'contato@conexonline.com.br',
    'smtp_pass'   => 'COLOQUE_A_SENHA_AQUI',

    // Remetente e destinatário
    'from_email'  => 'contato@conexonline.com.br',
    'from_name'   => 'Site ConexOn',
    'to_email'    => 'contato@conexonline.com.br',
    'to_name'     => 'ConexOn',

    // Domínio autorizado a chamar o endpoint
    'allowed_origin' => 'https://conexonline.com.br',
];
