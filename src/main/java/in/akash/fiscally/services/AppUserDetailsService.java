package in.akash.fiscally.services;

import java.util.List; // Changed from Collections

import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import this
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final ProfileRepository profileRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ProfileEntity existingProfile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with this email: " + email));

        return User.builder()
                .username(existingProfile.getEmail())
                .password(existingProfile.getPassword())
                // FIX: Give the user a default role instead of an empty list
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_USER"))) 
                .build();
    }
}