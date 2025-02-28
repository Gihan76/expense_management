export const FIELD_MANDATORY = "This field is mandatory";
export const POSTIVE_VALUE = (field) => `${field} must be positive`;
export const INVALID_DATE = "Invalid Date";
export const FUTURE_DATES_NOT_ALLOWED = "Future dates are not allowed";
export const PAST_DATES_NOT_ALLOWED = "Past dates before 2025 not allowed";

export const CUSTOMER_FILTER_OPTIONS = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' },
];

export const ROOT_PATH = "/";
export const EXPENSES_PATH = "/expenses";
export const INVENTORY_PATH = "/inventory";
export const LIST_EXPENSES_PATH = `${EXPENSES_PATH}/manage`;

export const LANDING_TILES = [
    {
        title: "Expenses Management",
        image: "landingTiles/expenses-management.jpeg",
        link: EXPENSES_PATH,
    },
    {
        title: "Inventory Management",
        image: "landingTiles/inventory-management.jpg",
        link: INVENTORY_PATH,
    },
];

export const THEME_COLORS = [
    { id: "light", name: 'Light', color: '#ffffff' },
    { id: "dark", name: 'Dark', color: '#262626' },
    { id: "pink", name: 'Pink', color: '#e91e63' },
    { id: "darkPink", name: 'Dark Pink', color: '#f599b8' },
];

export const EXPENSE_PAGE_ACTIONS = [
    {
        title: "View Expenses",
        logo: "/expenses/view_expense.png",
        navigateTo: LIST_EXPENSES_PATH,
        roles: ['administrator', 'moderator'],
        isDisabled: false,
    },
    {
        title: "Create Expense",
        logo: "/expenses/create_expense.png",
        navigateTo: `${LIST_EXPENSES_PATH}/create`,
        roles: ['administrator', 'moderator'],
        isDisabled: false,
    },
]