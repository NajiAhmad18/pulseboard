# Entity Relationship (ER) Diagram

This diagram outlines the core data models and their relationships within the MongoDB database for the Weekly Report Generator application.

```mermaid
erDiagram
    USER ||--o{ REPORT : "submits"
    PROJECT ||--o{ REPORT : "is tagged in"

    USER {
        ObjectId _id PK
        String name
        String email UK
        String password "hashed"
        String role "Enum: ['member', 'admin']"
        Date createdAt
        Date updatedAt
    }

    PROJECT {
        ObjectId _id PK
        String name UK
        String description
        Date createdAt
        Date updatedAt
    }

    REPORT {
        ObjectId _id PK
        ObjectId userId FK "Ref: User"
        ObjectId projectId FK "Ref: Project"
        Date weekStartDate
        Date weekEndDate
        String tasksCompleted
        String tasksPlanned
        String blockers "optional"
        Number hoursWorked "optional"
        String notes "optional"
        String status "Enum: ['draft', 'submitted']"
        Date createdAt
        Date updatedAt
    }
```

### Relationship Explanations
- **USER to REPORT (1-to-Many):** A single user (team member) can create and submit multiple weekly reports over time. A report belongs exclusively to one user.
- **PROJECT to REPORT (1-to-Many):** A single project can have multiple reports associated with it (from different members or across different weeks). A report is tagged to exactly one primary project for scope clarity.
