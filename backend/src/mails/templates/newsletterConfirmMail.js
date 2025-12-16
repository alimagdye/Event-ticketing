function newsletterConfirmTemplate(confirmationUrl, language = 'en') {
    if (language === 'en')
        return `
        <p>Thank you for subscribing to Fa3liat newsletter!</p>
        <p>Please confirm your subscription by clicking the link below:</p>
        <a href="${confirmationUrl}">Confirm Subscription</a>
        <p>If you did not subscribe, please ignore this email.</p>
    `;
    else if (language === 'ar')
        return `
        <p>شكراً لاشتراكك في نشرة فعاليات!</p>
        <p>يرجى تأكيد اشتراكك بالنقر على الرابط أدناه:</p>
        <a href="${confirmationUrl}">تأكيد الاشتراك</a>
        <p>إذا لم تقم بالاشتراك، يرجى تجاهل هذا البريد الإلكتروني.</p>
    `;
}

export default newsletterConfirmTemplate;
