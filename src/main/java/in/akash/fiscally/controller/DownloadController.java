package in.akash.fiscally.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.akash.fiscally.services.DownloadService;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/excel")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @GetMapping("/download/income")
    public void downloadIncomeExcel(HttpServletResponse response) {
        downloadService.downloadIncomeExcel(response);
    }

    @PostConstruct
public void init() {
    System.out.println("IncomeExportController loaded");
}
}
