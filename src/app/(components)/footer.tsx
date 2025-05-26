"use client";

import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

const Footer = () => {
  const { translate } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-auto border-t border-border bg-card">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} {translate('appName')}. {translate('tagline')}.</p>
      </div>
    </footer>
  );
};

export default Footer;
