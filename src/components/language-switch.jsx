import { useLanguage } from './language-provider';
import { IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './custom/button';

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  const languageText = new Map([
    ['en', 'English'],
    ['zh', '简体中文'],
  ]);

  const renderDropdownItem = () => {
    return Array.from(languageText).map(([key, value]) => {
      return DropdownMenuItem({
        key: key,
        onClick: () => setLanguage(key),
        children: [
          value,
          IconCheck({
            size: 14,
            className: cn('ml-auto', language !== key && 'hidden'),
          }),
        ],
      });
    });
  };

  return DropdownMenu({
    children: [
      DropdownMenuTrigger({
        asChild: true,
        children: [
          Button({
            variant: 'outline',
            size: 'default',
            className: 'scale-95 rounded-full',
            children: [
              languageText.get(language),
              { className: 'sr-only', children: 'Toggle language' },
            ],
          }),
        ],
      }),
      DropdownMenuContent({
        align: 'end',
        children: renderDropdownItem(),
      }),
    ],
  });
}

