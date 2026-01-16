package in.akash.fiscally.services;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.activation.DataSource;
import jakarta.mail.util.ByteArrayDataSource;

import in.akash.fiscally.entity.IncomeEntity;
import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.IncomeRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailAttachService {
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    private final JavaMailSender mailSender;

    public void sendIncomeExcelToUser() {

        try {
            ProfileEntity profile = profileService.getCurrentProfile();

            List<IncomeEntity> incomes =
                incomeRepository.findByProfile_IdOrderByDateDesc(profile.getId());

            // 1️⃣ Create Excel in memory
            byte[] excelBytes = generateExcel(incomes);

            // 2️⃣ Send Email
            sendEmailWithAttachment(
                profile.getEmail(),
                excelBytes
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to email income excel", e);
        }
    }

    private byte[] generateExcel(List<IncomeEntity> incomes) throws Exception {

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Income");

        String[] headers = { "Date", "Source", "Category", "Amount" };

        Row headerRow = sheet.createRow(0);
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowIndex = 1;
        for (IncomeEntity income : incomes) {
            Row row = sheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(income.getDate().toString());
            row.createCell(1).setCellValue(income.getName());
            row.createCell(2).setCellValue(
                income.getCategory() != null ? income.getCategory().getName() : "N/A"
            );
            row.createCell(3).setCellValue(income.getAmount().doubleValue());
        }

        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }

    private void sendEmailWithAttachment(String to, byte[] excelBytes) throws Exception {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Your Income Report");
        helper.setText(
            "Hi,\n\nPlease find attached your income report.\n\nRegards,\nFiscally Team"
        );

        DataSource dataSource = new ByteArrayDataSource(
            excelBytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        helper.addAttachment("income.xlsx", dataSource);

        mailSender.send(message);
    }

}
