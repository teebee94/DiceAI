// =======================================
// Theme Customization System
// Color presets and custom themes
// =======================================

class ThemeManager {
    constructor() {
        this.themes = {
            default: {
                name: 'Dark Blue',
                colors: {
                    primary: '#6366f1',
                    secondary: '#8b5cf6',
                    success: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    bgPrimary: '#0f172a',
                    bgSecondary: '#1e293b',
                    bgTertiary: '#334155'
                }
            },
            ocean: {
                name: 'Ocean',
                colors: {
                    primary: '#0ea5e9',
                    secondary: '#06b6d4',
                    success: '#14b8a6',
                    warning: '#f59e0b',
                    error: '#f43f5e',
                    bgPrimary: '#082f49',
                    bgSecondary: '#0c4a6e',
                    bgTertiary: '#075985'
                }
            },
            sunset: {
                name: 'Sunset',
                colors: {
                    primary: '#f97316',
                    secondary: '#fb923c',
                    success: '#84cc16',
                    warning: '#fbbf24',
                    error: '#dc2626',
                    bgPrimary: '#1c1917',
                    bgSecondary: '#292524',
                    bgTertiary: '#44403c'
                }
            },
            neon: {
                name: 'Neon',
                colors: {
                    primary: '#a855f7',
                    secondary: '#d946ef',
                    success: '#22d3ee',
                    warning: '#fde047',
                    error: '#f472b6',
                    bgPrimary: '#18181b',
                    bgSecondary: '#27272a',
                    bgTertiary: '#3f3f46'
                }
            },
            forest: {
                name: 'Forest',
                colors: {
                    primary: '#22c55e',
                    secondary: '#4ade80',
                    success: '#10b981',
                    warning: '#fbbf24',
                    error: '#f87171',
                    bgPrimary: '#14532d',
                    bgSecondary: '#166534',
                    bgTertiary: '#15803d'
                }
            }
        };

        this.currentTheme = 'default';
        this.loadTheme();
    }

    // Apply theme to CSS variables
    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = this.camelToKebab(key);
            root.style.setProperty(`--color-${cssVar}`, value);
        });

        this.currentTheme = themeName;
        localStorage.setItem('diceai_theme', themeName);

        console.log(`🎨 Theme changed to: ${theme.name}`);
    }

    // Load saved theme
    loadTheme() {
        const saved = localStorage.getItem('diceai_theme');
        if (saved && this.themes[saved]) {
            this.applyTheme(saved);
        }
    }

    // Helper: camelCase to kebab-case
    camelToKebab(str) {
        return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    // Get all available themes
    getThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            key,
            name: theme.name
        }));
    }

    // Create theme selector UI
    createThemeSelector() {
        const container = document.createElement('div');
        container.style.cssText = 'margin-top: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-border);';

        const label = document.createElement('label');
        label.style.cssText = 'display: block; margin-bottom: var(--space-sm); color: var(--color-text-secondary); font-size: var(--font-size-sm); font-weight: 600;';
        label.textContent = '🎨 Color Theme';

        const select = document.createElement('select');
        select.style.cssText = 'width: 100%; padding: var(--space-sm); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg-tertiary); color: var(--color-text); font-size: var(--font-size-base);';

        this.getThemes().forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.key;
            option.textContent = theme.name;
            option.selected = theme.key === this.currentTheme;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        container.appendChild(label);
        container.appendChild(select);

        return container;
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
