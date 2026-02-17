## Why

The application currently has a significant visual inconsistency between the authentication pages and the rest of the application. The sign-in and sign-up pages feature a premium, modern design with gradient backgrounds, decorative elements, smooth transitions, and polished styling, while the authenticated application pages (dashboard, navigation, client management, etc.) use basic, minimal styling that feels disconnected from the auth experience. This inconsistency creates a jarring user experience and undermines the "premium CRM" positioning. Improving the UI design to match the auth pages will create a cohesive, professional, and visually appealing experience throughout the application.

## What Changes

- **Enhance navigation components** (Header, Sidebar, Footer) with gradient accents, improved shadows, and decorative elements consistent with auth pages
- **Improve dashboard page** with gradient backgrounds, enhanced card styling, and visual hierarchy matching auth page quality
- **Enhance card components** with improved shadows, gradient borders, backdrop blur effects, and hover animations
- **Add gradient button variants** to match the gradient buttons used in auth forms
- **Improve table and list components** with better spacing, shadows, and visual polish
- **Add decorative elements** (subtle gradients, blurred shapes) to key pages for visual interest
- **Enhance form inputs** with improved focus states, borders, and transitions consistent with auth forms
- **Apply consistent color palette** using the blue-indigo gradient theme from auth pages throughout the app
- **Implement theme switching** (light/dark) with manual selection and system preference detection
- **Add theme toggle component** in header or sidebar for easy theme switching
- **Improve spacing and typography** for better visual hierarchy and readability
- **Add smooth transitions and animations** to interactive elements for a polished feel

## Capabilities

### New Capabilities
- `ui-design-system`: Establishes a cohesive visual design system with gradient themes, enhanced shadows, decorative elements, and consistent styling patterns. Defines design tokens and patterns that can be applied across all UI components to maintain visual consistency with the premium auth page aesthetic.

### Modified Capabilities
- `navigation-layout`: Visual styling enhancements to header, sidebar, and footer components (gradients, shadows, decorative elements). No functional requirements change - purely visual improvements.
- `client-management`: Visual styling enhancements to client list, cards, and detail views. No functional requirements change - purely visual improvements.

## Impact

**Affected Code:**
- `components/layout/Header.tsx` - Add gradient backgrounds, improved shadows, decorative elements
- `components/layout/Sidebar.tsx` - Enhance styling with gradients, shadows, improved hover states
- `components/layout/Footer.tsx` - Add subtle gradient or decorative elements
- `app/dashboard/page.tsx` - Add gradient backgrounds, enhance card styling
- `components/ui/card.tsx` - Enhance with improved shadows, gradient borders, hover effects
- `components/ui/button.tsx` - Add gradient variant matching auth page buttons
- `components/clients/ClientList.tsx` - Improve card and table styling
- `components/auth/UsersTable.tsx` - Improve card and table styling
- `components/ui/input.tsx` - Enhance focus states and borders to match auth forms
- `components/providers/ThemeProvider.tsx` - Create theme provider using next-themes
- `components/ui/ThemeToggle.tsx` - Create theme toggle component with Sun/Moon icons
- `app/layout.tsx` - Wrap with ThemeProvider for theme switching
- All page components - Apply consistent gradient backgrounds and decorative elements

**Dependencies:**
- Existing Tailwind CSS v4 utilities (gradients, shadows, backdrop-blur)
- `next-themes` package for theme switching (new dependency)
- Existing shadcn/ui components (will be enhanced, not replaced)

**Systems:**
- No database changes required
- No API changes required
- Pure visual/styling enhancements
- No breaking changes to component APIs

**Design Tokens:**
- Gradient color palette: `from-blue-600 via-blue-700 to-indigo-800` (primary), `from-indigo-600 via-purple-700 to-pink-800` (secondary)
- Shadow levels: `shadow-xl`, `shadow-lg`, `shadow-2xl` for depth
- Border radius: `rounded-2xl`, `rounded-xl` for consistency
- Backdrop blur: `backdrop-blur-sm` for glassmorphism effects
- Transition timing: `transition-all duration-200` for smooth interactions
