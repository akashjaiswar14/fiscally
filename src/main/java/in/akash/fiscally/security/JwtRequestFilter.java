package in.akash.fiscally.security;

import java.io.IOException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import in.akash.fiscally.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter{

        private final UserDetailsService userDetailsService;
        private final JwtUtil jwtUtil;


        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

            final String authHeader = request.getHeader("Authorization");
            String email = null;
            String jwt = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = authHeader.substring(7);
                System.out.println("DEBUG: Token Found in Header: " + jwt);
                try {
                    email = jwtUtil.extractUsername(jwt);
                    System.out.println("DEBUG: Username extracted: " + email);
                } catch (Exception e) {
                    System.out.println("DEBUG: Failed to extract username. Error: " + e.getMessage());
                    // Common cause: ExpiredJwtException or SignatureException
                }
            } else {
                System.out.println("DEBUG: No 'Authorization: Bearer ...' header found");
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
                    
                    if (jwtUtil.validateToken(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                        // 👇 ADD THIS DEBUG LINE 👇
                        System.out.println("DEBUG: User Roles: " + userDetails.getAuthorities());
                    } else {
                        System.out.println("DEBUG: Token validation failed (Expired or invalid signature)");
                    }
                } catch (Exception e) {
                    System.out.println("DEBUG: Error during user loading or validation: " + e.getMessage());
                }
            }

            filterChain.doFilter(request, response);
    }
}
