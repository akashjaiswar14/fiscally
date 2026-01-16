package in.akash.fiscally.services;

import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import in.akash.fiscally.entity.IncomeEntity;
import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.IncomeRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DownloadService {

    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;

    public void downloadIncomeExcel(HttpServletResponse response) {

        try {
            ProfileEntity profile = profileService.getCurrentProfile();

            List<IncomeEntity> incomes =
                incomeRepository.findByProfile_IdOrderByDateDesc(profile.getId());

            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Income");

            // HEADER
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

            // DATA
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

            response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            response.setHeader(
                "Content-Disposition",
                "attachment; filename=income.xlsx"
            );

            workbook.write(response.getOutputStream());
            workbook.close();

        } catch (IOException e) {
            throw new RuntimeException("Failed to export income excel", e);
        }
    }
}

