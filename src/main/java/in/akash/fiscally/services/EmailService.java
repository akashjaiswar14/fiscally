package in.akash.fiscally.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromMail;

    @Async
    public void sendEmail(String to, String subject, String body) {

        System.out.println("🔥 EMAIL METHOD ENTERED");
        System.out.println("FROM: " + fromMail);
        System.out.println("TO: " + to);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromMail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            System.out.println("✅ MAIL SENDER.SEND() CALLED");

        } catch (Exception e) {
            System.err.println("❌ EMAIL SEND FAILED");
            e.printStackTrace();
        }
    }

}
