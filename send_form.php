<?php
// send_form.php

// POSTメソッドでアクセスされた場合のみ実行
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // フォームの各入力値を取得
    $name     = $_POST["name"]     ?? "";
    $company  = $_POST["company"]  ?? "";
    $companyHP= $_POST["companyHP"]?? "";
    $email    = $_POST["email"]    ?? "";
    $tel      = $_POST["tel"]      ?? "";
    $message  = $_POST["message"]  ?? "";
    
    // 必須チェック（例：名前とメールは必須）
    if (empty($name) || empty($email)) {
        // 必須が足りない場合、エラー画面やフォームに戻すなどの処理
        exit("必須項目が入力されていません。");
    }

    // メール本文を組み立て
    $body = "お名前: $name\n会社名: $company\n会社HP: $companyHP\nメールアドレス: $email\n電話番号: $tel\n\n【お問い合わせ内容】\n$message\n";

    // 文字化け防止（日本語の場合）
    mb_language("ja");
    mb_internal_encoding("UTF-8");

    // メール送信（宛先は unplaced.prinfo@gmail.com、件名は仮）
    $to      = "unplaced.prinfo@gmail.com";
    $subject = "【UP Global Press】お問い合わせ";
    $headers = "From: " . mb_encode_mimeheader("UP Global Press") . " <no-reply@example.com>";

    // mail() はサーバー設定によっては送れない場合あり。代替ライブラリ(PHPMailer等)も検討
    $mailSuccess = mb_send_mail($to, $subject, $body, $headers);

    if ($mailSuccess) {
        // 送信成功時のリダイレクト（thank_you.html など）
        header("Location: thank_you.html");
        exit;
    } else {
        exit("メール送信に失敗しました。");
    }
} else {
    // GETやその他メソッドでアクセスされた場合
    exit("直接アクセスは許可されていません。");
}
