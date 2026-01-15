package in.akash.fiscally.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.akash.fiscally.services.EmailAttachService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailAttachController {

    private final EmailAttachService incomeEmailService;

    @PostMapping("/income-excel")
    public void emailIncomeExcel() {
        incomeEmailService.sendIncomeExcelToUser();
    }

}
