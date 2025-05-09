'use client';
import { useEffect } from 'react';

export default function DynamicColorSetter() {
    useEffect(() => {
        const hour = new Date().getHours();
        let theme = 'theme-midday';
        if (hour >= 5 && hour < 8) theme = 'theme-sunrise';
        else if (hour >= 8 && hour < 16) theme = 'theme-midday';
        else if (hour >= 16 && hour < 19) theme = 'theme-sunset';
        else theme = 'theme-night';
        document.documentElement.classList.add(theme);
      }, []);

  return null;
}
