### What is basel_geman?
**basel_geman** is a React-based single-page web application that enables users to compare German language courses offered by multiple schools in Basel, Switzerland. The application aggregates course information from three primary schools (ECAP, K5, and Academia) and provides filtering and search capabilities to help users find courses that match their requirements.

#### Target Users
The primary target users are:

- Individuals seeking German language instruction in Basel
- Language learners comparing course options across schools
- Prospective students evaluating courses by level, schedule, and price
- Anyone needing to quickly find German courses matching specific criteria (e.g., specific CEFR level, particular school, time of day)

### Core Functionality
The application provides three primary user-facing features:

1. #### Browsing:
   Display all 135 courses from ECAP, K5, and Academia schools with complete course details
2. #### Filtering:
   Filter courses by school (4 options: ECAP, K5, Academia, Bilingua) and proficiency level (7 options: A1, A2, B1, B2, C1, C2, Alpha)
4. #### Searching:
   Text-based search that filters courses by name in real-time

All three features work together — users can apply multiple filters simultaneously and combine them with text search to narrow results progressively.

## Project Structure

```text
basel_german/
├── src/
│   ├── components/
│   │   ├── layout/          # Page structure components
│   │   │   ├── App.jsx
│   │   │   ├── Main.jsx
│   │   │   ├── MenuBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Footer.jsx
│   │   └── common/          # Reusable UI components
│   │       ├── CustomCheckBox.jsx
│   │       ├── CustomButton.jsx
│   │       └── NoCourses.jsx
│   ├── context/
│   │   └── CoursesContext.jsx    # State management
│   ├── hooks/
│   │   └── useFilteredCourses.js # Data processing logic
│   ├── data/
│   │   └── data.json             # 135 course records
│   ├── assets/                   # Images (basel.png, school_icon.svg)
│   └── main.jsx                  # React entry point
├── vite.config.js                # Build configuration
└── package.json                  # Dependencies
```
