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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="scale-95 rounded-full">
          {languageText.get(language)}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Array.from(languageText).map(([key, value]) => (
          <DropdownMenuItem key={key} onClick={() => setLanguage(key)}>
            {value}
            <IconCheck size={14} className={cn('ml-auto', language !== key && 'hidden')} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}