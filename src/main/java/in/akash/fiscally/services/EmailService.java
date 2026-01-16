package in.akash.fiscally.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class EmailService {

    private static final String BREVO_URL =
            "https://api.brevo.com/v3/smtp/email";

    @Value("${BREVO_API_KEY}")
    private String apiKey;

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> payload = Map.of(
                "sender", Map.of(
                    "email", "akash9015jaiswar@gmail.com",
                    "name", "Fiscally"
                ),
                "to", new Object[]{
                    Map.of("email", to)
                },
                "subject", subject,
                "textContent", body
            );

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(payload, headers);

            restTemplate.postForEntity(
                    BREVO_URL,
                    request,
                    String.class
            );

            System.out.println("✅ BREVO API EMAIL SENT TO: " + to);

        } catch (Exception e) {
            System.err.println("❌ BREVO API EMAIL FAILED");
            e.printStackTrace();
        }
    }
}