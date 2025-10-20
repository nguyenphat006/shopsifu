import * as React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebarConfig, SidebarItem } from '@/constants/sidebarConfig';
import { useTranslations } from 'next-intl';

export function SearchItem() {
  const sidebarConfig = useSidebarConfig();
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [expanded, setExpanded] = React.useState<string[]>([]);

  const t = useTranslations()

  // Focus input when modal opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Toggle expand/collapse for subItems
  const toggleExpand = (href: string) => {
    setExpanded(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  // Render menu recursively
  const renderMenu = (items: SidebarItem[], level = 0) => (
    <ul>
      {items.map((item) => (
        <React.Fragment key={item.href}>
          <li
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-accent transition-colors text-sm',
              level === 0 && 'font-medium',
              level > 0 && 'pl-8',
              'select-none'
            )}
            onClick={() => {
              if (item.subItems && item.subItems.length > 0) {
                toggleExpand(item.href);
              } else {
                setOpen(false);
                router.push(item.href);
              }
            }}
          >
            {item.icon && level === 0 &&
              React.isValidElement(item.icon) && item.icon.type
                ? React.createElement(item.icon.type, {
                    className: cn('w-4 h-4 mr-2 text-muted-foreground')
                  })
                : null
            }
            <span>{item.title}</span>
            {item.subItems && item.subItems.length > 0 && (
              expanded.includes(item.href)
                ? <ChevronDown className="w-4 h-4 ml-auto text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
            )}
          </li>
          {item.subItems && item.subItems.length > 0 && expanded.includes(item.href) && (
            <li>
              {renderMenu(item.subItems, level + 1)}
            </li>
          )}
        </React.Fragment>
      ))}
    </ul>
  );

  // Lọc các item level 0 (menu chính)
  const items = sidebarConfig.filter(item => !!item.title && !!item.href);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center max-w-md w-full relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 bg-white cursor-pointer"
            onFocus={() => setOpen(true)}
            readOnly
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full p-0 bg-white rounded-xl shadow-2xl border-0">
        <DialogTitle className="sr-only">{t('admin.dashboard.searchMenu')}</DialogTitle>
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <Input
            ref={inputRef}
            placeholder={t('admin.dashboard.searchPlaceholder')}
            className="h-8 text-sm px-4 bg-gray-50 border-none border-b border-gray-400 focus:border-gray-600 focus-visible:ring-0 focus-visible:border-gray-600"
            autoFocus
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          <div className="text-xs text-muted-foreground px-2 pb-2">Menu</div>
          {renderMenu(items)}
        </div>
      </DialogContent>

    </Dialog>
  );
}

export default SearchItem;
