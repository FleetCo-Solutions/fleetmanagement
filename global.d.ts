// Allow importing CSS files (including side-effect imports like react-phone-input-2/lib/style.css)
// This prevents TypeScript errors when you import stylesheets directly from JS/TS files.
declare module '*.css';
declare module '*.scss';
declare module '*.sass';

// Specific declaration for the react-phone-input-2 stylesheet path (explicit path import)
declare module 'react-phone-input-2/lib/style.css';

// If you later import other non-TS assets (images, svgs), add similar declarations here, for example:
// declare module '*.svg';
