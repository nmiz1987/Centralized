'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOAST_STYLES } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface WebsiteIconFetcherProps {
  url: string;
  onIconSelect: (iconUrl: string) => void;
  isDisabled?: boolean;
}

interface IconOption {
  url: string;
  size: string;
}

export function WebsiteIconFetcher({ url, onIconSelect, isDisabled }: WebsiteIconFetcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [icons, setIcons] = useState<IconOption[]>([]);
  const [selectedIconUrl, setSelectedIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchIcons = async () => {
    if (!url) {
      toast.error('Please enter a valid URL first', TOAST_STYLES.error);
      return;
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid URL (e.g., https://example.com)', TOAST_STYLES.error);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Google's favicon service to get icons
      const domain = new URL(url).hostname;
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

      // Add different sizes for better quality
      const iconOptions: IconOption[] = [
        { url: iconUrl, size: '64x64' },
        { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`, size: '32x32' },
        { url: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`, size: '16x16' },
      ];

      // Test if at least one icon is accessible
      const testImage = new window.Image();
      testImage.src = iconUrl;

      await new Promise((resolve, reject) => {
        testImage.onload = resolve;
        testImage.onerror = () => reject(new Error('Failed to load icon'));
      });

      setIcons(iconOptions);
    } catch (error) {
      console.error('Error fetching icons:', error);
      setError('Failed to fetch website icons. Please try again or use a custom icon.');
      toast.error('Failed to fetch website icons', TOAST_STYLES.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchIcons();
  };

  const handleSelect = (iconUrl: string) => {
    setSelectedIcon(iconUrl);
    onIconSelect(iconUrl);
    setIsOpen(false);
    toast.success('Icon selected successfully', TOAST_STYLES.success);
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleOpen} disabled={isDisabled || !url} className="h-10">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch Icon'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Website Icon</DialogTitle>
          </DialogHeader>

          {error ? (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 py-4">
              {icons.map(icon => (
                <div
                  key={icon.url}
                  className={`flex cursor-pointer flex-col items-center rounded-lg border p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selectedIconUrl === icon.url ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => handleSelect(icon.url)}
                >
                  <div className="relative mb-2 h-8 w-8">
                    <Image src={icon.url} alt="Website icon" fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-xs text-gray-500">{icon.size}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
