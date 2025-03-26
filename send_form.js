// send_form.js (Netlify Functions などで使用)
const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  // POST メソッド以外は拒否
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "無効なJSON形式です。" }),
    };
  }

  // フォームの各項目を取得
  const { name, company, companyHP, email, tel, message } = data;

  // 必須項目チェック（例：名前とメールアドレスは必須）
  if (!name || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "必須項目（お名前、メールアドレス）が不足しています。" }),
    };
  }

  // nodemailer のトランスポーターを設定
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === "true", // 465ポートの場合 true、それ以外は false
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // メール本文の作成
  const mailOptions = {
    from: `"${name}" <${email}>`, // 送信元（ユーザーの名前とメールアドレス）
    to: "unplaced.prinfo@gmail.com", // 送信先
    subject: "【UP Global Press】お問い合わせ",
    text: `お名前: ${name}
会社名: ${company}
会社HP: ${companyHP}
メールアドレス: ${email}
電話番号: ${tel}

【お問い合わせ内容】
${message}`,
  };

  try {
    // メール送信
    let info = await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "お問い合わせを受け付けました。", info }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "メール送信に失敗しました。", details: error.toString() }),
    };
  }
};
