package in.akash.fiscally.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import in.akash.fiscally.dto.AuthDTO;
import in.akash.fiscally.dto.ProfileDTO;
import in.akash.fiscally.services.ProfileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
        public ResponseEntity<?> registerProfile(@RequestBody ProfileDTO profileDTO) {
            try {
                ProfileDTO registerProfile = profileService.registerProfile(profileDTO);
                return ResponseEntity.status(HttpStatus.CREATED).body(registerProfile);
            } catch (Exception e) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", e.getMessage()));
            }
        }

    @GetMapping("/activate")
    public ResponseEntity<String> activateProfile(@RequestParam String token){
        boolean isActivted = profileService.activateProfile(token);
        if(isActivted){
            return ResponseEntity.ok("Profile activated successfully");
        }
        else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Activation token not found or already exist");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthDTO authDTO){
        try {
            if(!profileService.isAccountActive(authDTO.getEmail())){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","Account is not active. Please activate your account first."));
            }
            Map<String, Object> response = profileService.authenticateAndGenerateToken(authDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                                                                        "message", e.getMessage()
                                                                    ));
        }
    }

    @GetMapping("/test")
    public String test(){
        return "test successfull";
    }
}
