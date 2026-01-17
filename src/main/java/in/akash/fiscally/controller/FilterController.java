package in.akash.fiscally.controller;

import java.time.LocalDate;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import in.akash.fiscally.dto.FilterDTO;
import in.akash.fiscally.services.ExpenseService;
import in.akash.fiscally.services.IncomeService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/filter")
public class FilterController {

    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    // @PostMapping
    // public ResponseEntity<?> filterTransaction(@RequestBody FilterDTO filter){
    //     LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;
    //     LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();
    //     String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";
    //     String sortFeild = filter.getSortFeild() != null ? filter.getSortFeild() : "date";
    //     Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortFeild()) ? Sort.Direction.DESC : Sort.Direction.ASC;
    //     Sort sort = Sort.by(direction, sortFeild);

    //     if("income".equals(filter.getType())){
    //         List<IncomeDTO> incomes = incomeService.filterExpense(startDate, endDate, keyword, sort);
    //         return ResponseEntity.ok(incomes);
    //     }
    //     else if("expense".equals(filter.getType())){
    //         List<ExpenseDTO> expenses = expenseService.filterExpense(startDate, endDate, keyword, sort);
    //         return ResponseEntity.ok(expenses);
    //     }
    //     else{
    //         return ResponseEntity.badRequest().body("Invalid type, Must be 'income' or 'expense'");
    //     }
    // }

    @PostMapping
    public ResponseEntity<?> filterTransaction(@RequestBody FilterDTO filter) {

        LocalDate startDate = filter.getStartDate() != null ? filter.getStartDate() : LocalDate.MIN;

        LocalDate endDate = filter.getEndDate() != null ? filter.getEndDate() : LocalDate.now();

        String keyword = filter.getKeyword() != null ? filter.getKeyword() : "";

        String sortField = (filter.getSortFeild() == null || filter.getSortFeild().isBlank()) ? "date" : filter.getSortFeild();

        Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;

        Sort sort = Sort.by(direction, sortField);

        if ("income".equalsIgnoreCase(filter.getType())) {
            return ResponseEntity.ok(incomeService.filterExpense(startDate, endDate, keyword, sort));
        }

        if ("expense".equalsIgnoreCase(filter.getType())) {
            return ResponseEntity.ok(expenseService.filterExpense(startDate, endDate, keyword, sort));
        }

        return ResponseEntity.badRequest().body("Invalid type. Must be 'income' or 'expense'");
    }

}
