package in.akash.fiscally;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;

import in.akash.fiscally.security.JwtRequestFilter;

@SpringBootApplication
public class FiscallyApplication {

	public static void main(String[] args) {
		SpringApplication.run(FiscallyApplication.class, args);
	}

	@Bean
	public FilterRegistrationBean<JwtRequestFilter> disableAutoFilterRegistration(JwtRequestFilter filter) {
		FilterRegistrationBean<JwtRequestFilter> registration = new FilterRegistrationBean<>(filter);
		registration.setEnabled(false); // ❌ Stop Spring from running it automatically
		return registration;
	}

}
