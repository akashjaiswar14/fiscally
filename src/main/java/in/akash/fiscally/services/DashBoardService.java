package in.akash.fiscally.services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import static java.util.stream.Stream.concat;

import org.springframework.stereotype.Service;

import in.akash.fiscally.dto.ExpenseDTO;
import in.akash.fiscally.dto.IncomeDTO;
import in.akash.fiscally.dto.RecentTransactionDTO;
import in.akash.fiscally.entity.ProfileEntity;
import lombok.RequiredArgsConstructor;
import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class DashBoardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    public Map<String, Object> getDashBoardData() {
        ProfileEntity profile = profileService.getCurrentProfile();
        Map<String, Object> returnValue = new LinkedHashMap<>();
        List<IncomeDTO> latestIncome = incomeService.getLatest5IncomeForCurrentUser();
        List<ExpenseDTO> latestExpense = expenseService.getLatest5ExpensesForCurrentUser();
        List<RecentTransactionDTO> recentTransactions = concat(
                latestIncome.stream().map(income -> RecentTransactionDTO.builder()
                        .id(income.getId())
                        .profileId(profile.getId())
                        .icon(income.getIcon())
                        .name(income.getName())
                        .amount(income.getAmount())
                        .date(income.getDate())
                        .createdAt(income.getCreatedAt()) // 👈 FIXED: Changed createdAt() to getCreatedAt()
                        .updatedAt(income.getUpdatedAt())
                        .type("income")
                        .build()),
                latestExpense.stream().map(expense -> RecentTransactionDTO.builder()
                        .id(expense.getId())
                        .profileId(profile.getId())
                        .icon(expense.getIcon())
                        .name(expense.getName())
                        .amount(expense.getAmount())
                        .date(expense.getDate())
                        .createdAt(expense.getCreatedAt())
                        .updatedAt(expense.getUpdatedAt())
                        .type("expense")
                        .build())
        ).sorted((a, b) -> {
            if (a.getDate() == null || b.getDate() == null) return 0; // Null safety check
            int cmp = b.getDate().compareTo(a.getDate());
            if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
                return b.getCreatedAt().compareTo(a.getCreatedAt());
            }
            return cmp;
        })
        .collect(Collectors.toList());

        BigDecimal totalIncome =
        incomeService.getTotalIncomeForCurrentUser() != null
                ? incomeService.getTotalIncomeForCurrentUser()
                : BigDecimal.ZERO;

        BigDecimal totalExpense =
                expenseService.getTotalExpenseForCurrentUser() != null
                        ? expenseService.getTotalExpenseForCurrentUser()
                        : BigDecimal.ZERO;

        returnValue.put("totalIncome", totalIncome);
        returnValue.put("totalExpense", totalExpense);
        returnValue.put("totalBalance", totalIncome.subtract(totalExpense));
        returnValue.put("recent5Expenses", latestExpense);
        returnValue.put("recent5Income", latestIncome);
        returnValue.put("recentTransaction", recentTransactions);

        return returnValue;
    }
} 