import { Platform } from 'react-native';

// Check if running on web
export const isWeb = Platform.OS === 'web';

// Get responsive class based on screen size
export const getResponsiveClass = (
  mobile: string = '',
  tablet: string = '',
  desktop: string = ''
): string => {
  let classes = mobile;
  if (tablet) classes += ` web:${tablet}`;
  if (desktop) classes += ` desktop:${desktop}`;
  return classes;
};

// Web-specific keyboard event handler
export const handleKeyPress = (
  event: any,
  handlers: Record<string, () => void>
) => {
  if (!isWeb) return;
  
  const { key, ctrlKey, metaKey } = event.nativeEvent || event;
  const cmdKey = ctrlKey || metaKey;
  
  // Handle keyboard shortcuts
  if (cmdKey && handlers[`cmd+${key.toLowerCase()}`]) {
    event.preventDefault();
    handlers[`cmd+${key.toLowerCase()}`]();
    return;
  }
  
  if (handlers[key]) {
    handlers[key]();
  }
};

// Format text for web display
export const formatTextForWeb = (text: string): string => {
  if (!isWeb) return text;
  
  // Replace line breaks with proper spacing for web
  return text.replace(/\n\n/g, '\n\n').trim();
};

// Check if device supports hover interactions
export const supportsHover = (): boolean => {
  if (!isWeb) return false;
  
  try {
    return window.matchMedia('(hover: hover)').matches;
  } catch {
    return false;
  }
};

// Add web-specific focus management
export const manageFocus = (element: any) => {
  if (!isWeb || !element) return;
  
  // Add focus ring styles for accessibility
  if (element.focus) {
    element.focus();
  }
};

// Web-specific clipboard operations
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!isWeb) return false;
  
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
};

// Download functionality for web
export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  if (!isWeb) return;
  
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};