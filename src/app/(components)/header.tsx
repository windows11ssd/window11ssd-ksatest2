"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sun, Moon, Languages, Check, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import type { Language } from '@/lib/types';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, translate, dir } = useTranslation();

  const languages: { code: Language; nameKey: keyof ReturnType<typeof translate_any>; icon?: React.ElementType }[] = [
    { code: 'en', nameKey: 'english' },
    { code: 'ar', nameKey: 'arabic' },
  ];
  
  // A dummy translate function for keys not in the main context (like specific language names)
  const translate_any = (key: string) => ({ english: "English", arabic: "العربية" }[key] || key);


  return (
    <header className="py-4 px-6 bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">{translate('appName')}</h1>
        </Link>
        
        <div className="flex items-center gap-3">
          <DropdownMenu dir={dir}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={translate('language')}>
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'}>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className="flex items-center justify-between"
                >
                  <span>{translate(lang.nameKey as any)}</span>
                  {language === lang.code && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={translate('theme')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
