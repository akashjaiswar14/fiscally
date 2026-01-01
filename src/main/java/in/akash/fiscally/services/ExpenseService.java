package in.akash.fiscally.services;

import org.springframework.stereotype.Service;

import in.akash.fiscally.dto.ExpenseDTO;
import in.akash.fiscally.entity.CategoryEntity;
import in.akash.fiscally.entity.ExpenseEntity;
import in.akash.fiscally.entity.ProfileEntity;
import in.akash.fiscally.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final CategoryService categoryService;
    private final ExpenseRepository expenseRepository;

    // helper method
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category){
        return ExpenseEntity.builder()
                            .name(dto.getName())
                            .icon(dto.getIcon())
                            .amount(dto.getAmount())
                            .date(dto.getDate())
                            .profile(profile)
                            .category(category)
                            .build();
    }

    private ExpenseDTO toDTO(ExpenseEntity entity){
        return ExpenseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId(): null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName(): "N/A")
                .amount(entity.getAmount())
                .date(entity.getDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
