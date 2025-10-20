---
mode: ask
---

## Expected output and any relevant constraints for this task.

description:
globs:
alwaysApply: true

---

React Project Data Fetching Rules
Data Fetching Architecture
Our project follows a structured approach to data fetching, organizing code across several key folders and files:
Component-level Hooks

Custom hooks for specific features are placed directly in the component folder
Examples: useSignin, useProducts, etc.
These hooks call services directly without intermediate hooks
The Hooks folder is reserved for shared utility hooks only (e.g., useResize, useLocalStorage)

API Layer (/lib/api.ts)

Contains three main axios instances:

publicAxios: For endpoints that don't require authentication
privateAxios: For authenticated endpoints (automatically includes tokens)
refreshAxios: Specifically designed for token refresh operations

Service Layer (/services)

Services encapsulate all API calls to backend endpoints
Naming convention: featureService.ts (e.g., authService.ts, productService.ts)
Services use API URLs defined in constants, not hardcoded values

Constants

/constants/api.ts: Contains all backend API endpoint paths
/constants/route.ts: Defines frontend routes for navigation (e.g., LOGIN = "/login")

Types

Types and interfaces are in /types folder
Naming convention: feature.interface.ts (e.g., auth.interface.ts)
Each feature has its own dedicated interface file

Implementation Guidelines

Always use the correct axios instance for the endpoint type
Never hardcode API URLs - always reference from constants
Service functions should be descriptive and handle specific API operations
Feature-specific hooks should be placed with their components
Shared hooks go in the central Hooks folder
Always define types for request/response data in dedicated interface files

## Following these guidelines ensures consistent, maintainable code and clear separation of concerns across the application.

description:
globs:
alwaysApply: false

---

# Module Development Rules

## Module Structure

When implementing a new module, follow this standardized structure:

### Page Component

- Location: `/app/(routes)/module-name/page.tsx`
- Purpose: Entry point for the module
- Basic structure:

  ```typescript
  "use client";
  import { ModuleTable } from "@/components/admin/module-name/module-Table";

  export default function ModulePage() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">[Module Title]</h2>
          <p className="text-muted-foreground">[Brief module description]</p>
        </div>
        <ModuleTable />
      </div>
    );
  }
  ```

### Module Components

Each module should include these standard files:

1. **`module-Columns.tsx`**

   - Purpose: Define data table columns configuration
   - Contains column definitions, formatters, and actions

2. **`module-ModalUpSert.tsx`**

   - Purpose: Modal UI for Create/Edit operations
   - Handles form validation and submission

3. **`module-Table.tsx`**

   - Purpose: Main data table component
   - Integrates reusable `data-table` component
   - Includes pagination and search functionality
   - Example structure:

     ```typescript
     "use client";
     import { DataTable } from "@/components/ui/data-table/data-table";
     import { Pagination } from "@/components/ui/data-table/pagination";
     import { SearchInput } from "@/components/ui/data-table/search-input";
     import { columns } from "./module-Columns";
     import { useModule } from "./useModule";

     export function ModuleTable() {
       const { data, isLoading, pagination, search } = useModule();

       return (
         <div className="space-y-4">
           <SearchInput placeholder="Search..." onChange={search.onChange} />
           <DataTable columns={columns} data={data} isLoading={isLoading} />
           <Pagination
             totalPages={pagination.totalPages}
             currentPage={pagination.currentPage}
             onPageChange={pagination.onPageChange}
           />
         </div>
       );
     }
     ```

4. **`module-MockData.tsx`** (optional)

   - Purpose: Define sample data for development
   - Used before API integration is complete

5. **`useModule.tsx`**
   - Purpose: Custom hook for module logic
   - Handles API calls via service layer
   - Manages state, pagination, search, and CRUD operations

## Reusable UI Components

Leverage these shared UI components for consistent implementation:

1. **`data-table.tsx`**
   - Core table component with standard features
2. **`data-table-column-header.tsx`**

   - For sortable column headers

3. **`data-table-row-actions.tsx`**

   - Standard row action buttons (edit/delete)

4. **`pagination.tsx`**

   - Standardized pagination controls

5. **`search-input.tsx`**
   - Search input component with standard behavior

## Implementation Guidelines

1. Always use the standardized module structure
2. Keep page components simple, delegating logic to custom hooks
3. Use the shared UI components for consistency
4. Implement module-specific logic in the `useModule` hook
5. Connect to services for API operations
6. Define proper interfaces for all data structures
7. Follow naming conventions consistently

This structure ensures maintainable, consistent module implementations across the application.



You must follow exactly what is requested.
Do not assume, add, or do anything beyond the specific instruction.
If additional clarification is needed, you must ask the user before proceeding.
All responses must be written in Vietnamese only.