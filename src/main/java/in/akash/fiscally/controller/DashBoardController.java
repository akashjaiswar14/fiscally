package in.akash.fiscally.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.akash.fiscally.services.DashBoardService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashBoardController {

    private final DashBoardService dashBoardService;

    public ResponseEntity<Map<String, Object>> getDashboardData(){
        Map<String, Object> dashBoardData = dashBoardService.getDashBoardData();
        return ResponseEntity.ok(dashBoardData);
    }
}
